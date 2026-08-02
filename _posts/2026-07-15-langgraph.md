---
layout: post
title: "什么是LangGraph？"
date:   2026-07-15
tags: ['Coding']
comments: true
author: kwanwaipang
toc: true
excerpt: "从 Graph / State / Node / Edge 讲起，顺着 Hello World、持久化、人机交互，再到多 Agent 协作与计划执行，用尽量通俗又完整的方式说明：LangGraph 到底在补哪块短板、怎么把 Agent 真正跑起来。"
---


<!-- * 目录
{:toc} -->


# 引言

大模型应用开发，大致走过这样一条路：

1. **Prompt 工程**：一次问答，能用，但做不深；
2. **Chain（链）**：多步串起来，像流水线；
3. **Agent**：模型开始调工具、做决策；
4. 再往后——真实业务往往不是「笔直单行道」，而是**带循环、带分支、带中断、带记忆**的流程。

举例：

* Agent 写完代码要跑测试，失败就回去改，直到通过；
* 多步任务里，中间结果必须能被后面的节点读到；
* 发邮件、删数据这类动作，必须先停下来等人确认。

传统线性 Chain（包括早期偏 DAG 的编排）在这类场景会吃力。LangChain 团队因此推出了专门做**状态化、可循环工作流**的框架：**LangGraph**。

本文按「问题如何长出来 → 组件是什么 → 怎么搭一个最小应用 → 进阶能力与两个复杂案例」展开。概念脉络参考了公开课程[《从零吃透 LangGraph 全套实战》](https://www.bilibili.com/video/BV12hJM6XEHS/)（UP：吴恩达Agents），下文为本人整理与改写，仅供学习记录。

相关前文：

* [什么是Agent？：从 LLM 到 Skill / MCP / RAG](/Agent基本概念梳理/)


# 一句话理解 LangGraph

可以先记住三句：

~~~
LangGraph ≈ 用「图」来编排 Agent / LLM 工作流的框架。
节点负责干活，边负责走向，状态负责在节点之间传上下文。
它不替代 LangChain；更像是把零件装配成可循环、可中断机器的控制中枢。
~~~

再展开一点：

* **Graph（图）**：整张工作流的骨架；
* **Node（节点）**：一步动作——调模型、调工具、写文件、做路由判断；
* **Edge（边）**：节点之间的连线——普通边固定跳转，条件边靠路由函数决定；
* **State（状态）**：全图共享的「上下文 / 存档」，每个节点可读可写。

和游戏很像：节点像关卡，状态像存档，边像通关后该进哪一关。LangGraph 的持久化，也常被称作 **Checkpoint（检查点 / 存档点）**。


# LangGraph 和 LangChain 是什么关系？

它们不是互相取代，而是**互补**：

| 维度 | LangChain（含 LCEL） | LangGraph |
|---|---|---|
| **定位** | 组件与线性/链式拼装 | 状态化、可循环的工作流编排 |
| **控制流** | 偏 DAG，线性或树状 | 原生支持循环、条件分支、回跳 |
| **状态** | 多靠开发者手动传参 | 内置全局 State + Reducer |
| **人机交互** | 需自己拼装中断逻辑 | 内置断点 / interrupt |
| **持久化** | 常见于聊天历史等局部能力 | Checkpointer 覆盖整图执行快照 |
| **零件来源** | Model、Prompt、Tool、Parser… | 节点里可以直接嵌入 LCEL / Runnable |

一句话：**LangChain 提供零件，LangGraph 提供能转起来的装配图。**


# 先看一张总览图

把人、图、模型、工具的位置放在一起，后面几节会逐块拆开。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart TB
    classDef user fill:#FFF3E0,stroke:#E65100,color:#222
    classDef graph fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef model fill:#F3E5F5,stroke:#6A1B9A,color:#222
    classDef tool fill:#E8F5E9,stroke:#2E7D32,color:#222
    classDef state fill:#FFF8E1,stroke:#F9A825,color:#222

    U["你 / 自然语言任务"] --> G["LangGraph 运行时<br/>编译后的 Graph"]
    G --- S["State<br/>共享上下文 / Checkpoint"]
    G --> A["Agent 节点<br/>调 LLM、决定下一步"]
    G --> T["Tool 节点<br/>真正执行工具"]
    A <-->|"Tool Calling"| L["LLM"]
    T --> X["搜索 / 代码执行 / API…"]
    A -.->|"条件边 / 路由"| T
    T -->|"普通边"| A
    G --> E["END"]

    class U user
    class G,A graph
    class L model
    class T,X tool
    class S state
</div>

<p align="center"><em>图 1：LangGraph 里人、State、Agent 节点、Tool 节点与 LLM 的相对位置</em></p>


# 核心组件：Graph、State、Node、Edge

官方文档条目很多，入门其实只需抓住这四块。课程里也常把它们称作「四大组件」——先吃透这四个，Hello World 和后面的复杂案例都能对得上号。


## 1. Graph：先有一张「能转的图」

工作中最常用的是 **`StateGraph`**：一张带着共享状态流转的图。  
另有偏聊天场景的 `MessageGraph`，一般业务更推荐从 `StateGraph` 起步。

构建套路很固定：

1. 用 `StateGraph(某State类型)` 建图；
2. `add_node` 加节点；
3. `set_entry_point` / 普通边 / 条件边把线连上；
4. `compile(...)` 编译成可 `invoke` / `stream` 的对象。

编译不是可有可无的一步。编译时框架会把节点、边、监控（如与 LangSmith 的整合）、检查点等拼成一个可运行对象——你写的代码不多，跑起来时内部已经挂了不少工程能力。

> **NOTE：**  
> 私有模型怎么接？和在 LangChain 里换模型一样：换掉创建 LLM 的那一行（OpenAI / 通义 / Claude 等），后面的图结构通常不用推倒重来。


## 2. State：节点之间怎么「共享存档」

State 是整张图的共享内存，常见写法是 `TypedDict`、Pydantic 模型，或直接用官方的 **`MessagesState`**（专门传 `HumanMessage` / `AIMessage` / `ToolMessage` 等）。

关键点只有几条：

1. **共享，不是每节点一份私有字典**。每个节点都能读当前状态，并返回要更新的字段；
2. **节点返回值会被写回 State**。在 LangGraph 里，节点函数 `return {...}` 往往就够了，框架帮你合并进状态；
3. **更新靠 Reducer（归约函数）**。默认可以覆盖；消息列表这类字段常用 `Annotated[list, add_messages]` 或 `operator.add`，避免后一步把前一步消息冲掉。

把 State 想成「一直往下传的上下文」就很直观：工具拿到的天气、模型返回的报文、路由判断用到的字段，最终都落在这份上下文里；`invoke` 结束后你拿到的结果，常常就是最终 State 里取出来的内容。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
    classDef n fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef s fill:#FFF8E1,stroke:#F9A825,color:#222

    S0["State v0"] --> N1["节点 1"]
    N1 -->|"return 局部更新"| R["Reducer 合并"]
    R --> S1["State v1"]
    S1 --> N2["节点 2"]
    N2 -->|"return 局部更新"| R2["Reducer 合并"]
    R2 --> S2["State v2"]

    class N1,N2 n
    class S0,S1,S2,R,R2 s
</div>

<p align="center"><em>图 2：节点执行 → 返回更新 → Reducer 合并 → 新 State 传给下一节点</em></p>

需要传消息以外的字段时（例如发送者 `sender`、自定义业务字段），可以自己定义 `AgentState`；只做对话时，优先用 `MessagesState`。


## 3. Node：节点本质上就是「干活的函数」

节点可以非常朴素地理解成：**接收 State 的函数**。

~~~python
def call_model(state: MessagesState):
    # 从 state 读消息 → 调 LLM → 把新消息写回
    response = model.invoke(state["messages"])
    return {"messages": [response]}
~~~

三类节点要分清：

| 类型 | 作用 |
|---|---|
| **普通节点** | 你写的业务函数：调模型、整理数据、写结果 |
| **起始 / 入口** | 图从哪里启动；没有入口点会无法执行 |
| **结束节点 `END`** | 框架提供的特殊终点，任务完成时指向它 |

工具相关还有一个专门类型：**`ToolNode`**。  
为什么工具不直接当普通函数塞进去？因为工具常常是「列表 + 结构化调用结果」，框架要做额外解析与派发；所以常见写法是：

* 大模型节点：普通函数 + `bind_tools(...)`；
* 工具节点：`ToolNode(tools)`。

> **NOTE：**  
> 节点本身没有「默认私有状态」；状态是全图共享的。节点产生的结果，通过返回值进入共享 State。


## 4. Edge：线怎么连，决定图怎么「走」

边分几类：

1. **普通边**：A 结束一定到 B（实线，确定）；
2. **条件边**：中间挂一个**路由函数**，根据 State 决定走哪条（虚线，动态）；
3. **入口边 / 入口点**：从 `START` 指向第一个业务节点；
4. **条件入口点**：一开始就要在多个入口之间做选择（概念与条件边类似，只是作用在入口）。

路由函数是读图的关键。Hello World 里最经典的一支是：

* 若模型输出了 tool calls → 走向 `tools`；
* 否则 → 走向 `END`。

一个节点也可以有多条出边；复杂系统里，还会根据「是谁把你送进工具节点的」（sender / path map）决定工具执行完后回到哪条路上——这就是后面多 Agent 案例里「动态条件边」的味道。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
    classDef node fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef endn fill:#FFCDD2,stroke:#C62828,color:#222
    classDef tool fill:#E8F5E9,stroke:#2E7D32,color:#222

    START((START)) --> Agent["Agent 节点"]
    Agent -->|"条件边：要调工具"| Tools["Tools 节点"]
    Agent -->|"条件边：可直接答"| ENDN((END))
    Tools -->|"普通边：结果回填"| Agent

    class Agent node
    class Tools tool
    class ENDN endn
</div>

<p align="center"><em>图 3：Hello World 级最小循环——Agent ⇄ Tools，或 Agent → END</em></p>


# 搭一个最小应用：天气查询 Hello World

课程里用「查上海天气」把整条开发流程串了一遍。这里按同样顺序重述，便于对照代码阅读。


## 开发顺序可以记成 8 步

1. **准备工具**：用 `@tool` 把函数变成工具（示例里甚至可以只是「字符串里有没有上海」的假搜索，方便演示）；
2. **工具列表**：放进 `tools = [...]`；
3. **绑定模型**：`model.bind_tools(tools)`，让模型能提出结构化调用；
4. **工具节点**：`ToolNode(tools)`；
5. **业务节点**：写 `call_model` 之类函数；
6. **路由函数**：如 `should_continue`，决定走 `tools` 还是 `END`；
7. **组图**：`StateGraph` → `add_node` → `set_entry_point` → `add_conditional_edges` / `add_edge`；
8. **编译并运行**：`compile(checkpointer=MemorySaver())`，再 `invoke` / `stream`，并用 `thread_id` 维持同一会话。

伪代码骨架如下（细节以你本地可运行为准）：

~~~python
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

# 1-4. tools / model.bind_tools / ToolNode ...
# 5. def call_model(state): ...
# 6. def should_continue(state): ...

workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
workflow.add_edge("tools", "agent")

app = workflow.compile(checkpointer=MemorySaver())
app.invoke(
    {"messages": [("user", "上海天气怎么样？")]},
    config={"configurable": {"thread_id": "1"}},
)
~~~

跑通后你会看到两件「Agent 感」很强的事：

1. 第一问匹配到工具，返回温度等信息；
2. 同一 `thread_id` 下再问「我刚问的是哪个城市？」，它能接上上下文——这就是 **State + Checkpointer** 在起作用。

> **NOTE：**  
> 市面上那些可拖拽的 Agent 工作流产品，思想与这类图编排很接近。简单增删改查用拖拽就够；要精细控制、复杂分支、多 Agent 协作时，代码级的 LangGraph 往往更合适。


# 进阶能力一：持久化（Checkpoint）

State 解决「这一轮图运转时数据怎么传」；**Checkpointer** 解决「跨调用、跨进程，如何把整图执行快照存下来」。

可以把它想成游戏自动存档：

* 每完成一个关键步骤，就留下一份快照；
* 下次用同一个 `thread_id` 进来，带着上一关的结果继续；
* 换一个 `thread_id`，就是另一条互不影响的会话线。

常见实现：

* **`MemorySaver`**：进程内内存，适合开发调试；
* **`SqliteSaver` / 异步版本**：落到文件或数据库，适合更持久的场景；
* 自定义：官方以 `Base` 形式开放扩展思路，原则上也可接到 Redis 等（需自行实现序列化与存储）。

和「只存聊天历史」的 Message History 相比，Checkpoint 更广：它存的是**节点执行过程中的状态快照**，不只是对话气泡。

结合 `stream`，还可以把每一步事件漂亮地打印出来，便于观察「这一步 State 变成了什么」。


# 进阶能力二：人机交互（Human-in-the-Loop）

当流程走到「必须问人」的地方，LangGraph 用**断点**把控制权交还人类。

典型用法是编译时设置 `interrupt_before=["某个节点"]`：

1. 图正常跑到断点前暂停；
2. 宿主向用户展示选项（yes/no，或 1/2/3…）；
3. 用户确认后，再 `stream` / `invoke` 一次，让图从断点继续；
4. 若用户拒绝，则走取消 / 结束分支，不再执行危险节点。

这和手机客服「按 1 办理、按 2 查询」非常像：AI 负责推进，人负责关键闸门。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
    classDef n fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef human fill:#FFF3E0,stroke:#E65100,color:#222
    classDef endn fill:#FFCDD2,stroke:#C62828,color:#222

    A["步骤 1"] --> B["步骤 2"]
    B --> I{"interrupt_before<br/>步骤 3"}
    I -->|"用户 yes：继续"| C["步骤 3"]
    I -->|"用户 no：取消"| E((END))
    C --> E2((END))

    class A,B,C n
    class I human
    class E,E2 endn
</div>

<p align="center"><em>图 4：在关键节点前打断，等人确认后再继续或结束</em></p>

适用场景：自动发邮件、执行转账、删除数据、生成后需人工审阅的报告等。断点是**按节点**加的，一张图上可以有多处。


# 复杂案例一：多 Agent 协作

前面 Hello World 只有一个 Agent 节点。真实需求常常是：**多个角色分工，还要互相交接。**

课程示例需求可以概括成一句话：

> 「根据近五年 AI 软件市场规模，生成一张曲线图。」

这至少拆成两个 Agent：

1. **Research Agent**：用搜索工具（如 Tavily）抓公开数据；
2. **Chart Agent**：把数据整理成可画图的结构，并生成 / 执行画图代码（示例里用 Python REPL 动态执行模型写出的绘图代码）。

协作流程大致是：

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart TB
    classDef user fill:#FFF3E0,stroke:#E65100,color:#222
    classDef agent fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef tool fill:#E8F5E9,stroke:#2E7D32,color:#222
    classDef endn fill:#FFCDD2,stroke:#C62828,color:#222

    U["用户：要近五年市场规模曲线"] --> R["Research Agent"]
    R -->|"调用"| S["Tavily 等搜索工具"]
    S -->|"有结果"| R
    R -->|"数据交接"| C["Chart Agent"]
    C -->|"生成代码并调用"| P["Python REPL / 绘图"]
    P -->|"图或代码有问题：重试"| C
    C -->|"FINAL ANSWER"| E((END))
    R -->|"超过步数仍无结果"| E

    class U user
    class R,C agent
    class S,P tool
    class E endn
</div>

<p align="center"><em>图 5：Research 与 Chart 两个 Agent 协作，工具层可循环重试</em></p>

这里有几个值得单独记的工程点：

1. **动态创建 Agent / 节点**：角色一多，就不能在代码里写死十几个几乎相同的函数，而要用工厂函数按「模型 + 工具 + 提示词」批量创建；
2. **提示词要写明多助手协作**：例如「你是助手之一；答不全时可由其他助手接续；出现最终交付物则停止」；
3. **自定义 State**：除消息外，还可能需要 `sender` 等字段，供条件边判断「该把控制权交还给谁」；
4. **步数上限**：搜索或代码生成可能死循环，编译/执行时限制 `recursion_limit`（课程示例里用较大上限防空转烧 Token）；
5. **动态条件边**：工具节点执行完后，根据进入时的路口（sender）决定回到 Research 还是 Chart。

> **NOTE：**  
> 用 REPL 执行模型生成的 Python，主要是为了演示「代码也可被当作工具」。生产环境要严格做沙箱、权限与审计，不能把演示写法直接上线。


# 复杂案例二：计划执行（Plan-and-Execute / ReAct）

多 Agent 讲「角色分工」；计划执行讲「把大任务拆成小步骤，边做边修正」。

它和 ReAct（Reason + Act）同一类思路：

1. **Plan**：把目标拆成逐步计划；
2. **Act / Execute**：逐步调用工具执行；
3. **Replan**：某步失败、结果不对或偏离原目标时，对照「原计划 + 已完成步骤」重新规划；
4. 直到得到最终答案，或触达循环上限。

课程示例问题：

> 「2024 巴黎奥运会 100 米自由泳冠军的家乡在哪里？」

这看起来是一问，实际至少包含：

1. 先查出冠军是谁；
2. 再查其家乡；
3. （若要求）用中文整理输出。

步骤之间有依赖：冠军找错，家乡一定错。所以需要循环与反思，而不是一次性瞎猜。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
    classDef plan fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef act fill:#E8F5E9,stroke:#2E7D32,color:#222
    classDef rep fill:#FFF8E1,stroke:#F9A825,color:#222
    classDef endn fill:#FFCDD2,stroke:#C62828,color:#222

    P["Planner<br/>拆解计划"] --> A["Agent / Executor<br/>逐步执行"]
    A --> J{"得到最终答案？"}
    J -->|"否"| R["Replan<br/>对照原目标纠偏"]
    R --> A
    J -->|"是"| E((END))
    A -->|"超过步数"| E

    class P plan
    class A act
    class R,J rep
    class E endn
</div>

<p align="center"><em>图 6：计划 → 执行 →（必要时）再计划，直到结束或触顶</em></p>

实现上常见几块对象：

* **PlanState**：目标、计划列表、已执行步骤、最终响应；
* **Planner**：根据目标生成逐步计划（提示词强调「不要多余步骤，最后一步应是最终答案」）；
* **Executor / Agent**：按步调用工具（如 Tavily）；
* **Replan 提示词**：显式写入「原计划是什么、当前完成到哪一步、不要跑偏」——用来对抗幻觉与检索跑题；
* **`should_end` 路由**：有最终答案就结束，否则继续循环。

> **NOTE：**  
> 循环次数几乎必然带来 Token 消耗；幻觉也无法靠循环彻底消灭。工程上常见配套是：更紧的提示词、关键点校验、多次生成对比、以及把稳定好结果缓存起来。需要用户表态时，再叠加上一节的断点。


# 选型与学习路径

可以把能力叠代看成一条由浅入深的路：

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart BT
    classDef base fill:#ECEFF1,stroke:#455A64,color:#222
    classDef mid fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef adv fill:#FFF3E0,stroke:#EF6C00,color:#222

    P1["① 吃透四组件<br/>Graph / State / Node / Edge"] --> P2["② Hello World<br/>工具调用闭环 + thread_id"]
    P2 --> P3["③ Checkpointer<br/>MemorySaver / SQLite"]
    P3 --> P4["④ Human-in-the-loop<br/>interrupt_before"]
    P4 --> P5["⑤ 多 Agent 协作<br/>动态节点 / 交接 / 路由"]
    P5 --> P6["⑥ 计划执行<br/>Plan / Act / Replan"]

    class P1,P2 base
    class P3,P4 mid
    class P5,P6 adv
</div>

<p align="center"><em>图 7：建议学习顺序——先会转起来，再加存档与断点，最后上多 Agent 与计划执行</em></p>

选型上可以很朴素：

* 流程稳定、分支少 → 普通 Chain / 工作流拖拽也可能够用；
* 需要循环纠错、精细状态、人机审批 → LangGraph 更合适；
* 多角色分工、动态创建能力 → 多 Agent 图；
* 目标大、步骤有依赖、要边做边改 → 计划执行 / ReAct 图。


# 总结

先收一张极简对照表：

| 概念 | 一句话 |
|---|---|
| **LangGraph** | 用图编排状态化、可循环 LLM / Agent 工作流的框架 |
| **Graph** | 工作流骨架；常用 `StateGraph`，编译后才能跑 |
| **State** | 全图共享上下文；靠 Reducer 合并更新 |
| **Node** | 干活的函数；工具场景常用 `ToolNode` |
| **Edge** | 控制走向；条件边依赖路由函数 |
| **Checkpoint** | 整图执行快照 / 存档，支撑多轮与恢复 |
| **Human-in-the-loop** | 在节点前打断，等人确认再继续 |
| **多 Agent** | 多角色分工 + 状态交接 + 动态路由 |
| **计划执行** | 拆计划 → 执行 → 再计划，直到完成或触顶 |

再回到开头那句：

~~~
模糊判断交给模型；
确定流程、记忆、中断、协作交给图与宿主程序。
LangGraph 做的，正是把后者变成可复用的工程结构。
~~~

后续若写实践笔记，会更适合落到具体仓库：例如把天气 Hello World、带断点的审批流、或 Research + Chart 多 Agent，做成可运行的最小项目，与本文概念逐项对齐。


# 参考资料

* [LangGraph 官方文档](https://langchain-ai.github.io/langgraph/)
* [LangGraph GitHub](https://github.com/langchain-ai/langgraph)
* 公开课程：[从零吃透 LangGraph 全套实战（Bilibili BV12hJM6XEHS）](https://www.bilibili.com/video/BV12hJM6XEHS/)（学习参考，本文为改写整理）
* 前文：[什么是Agent？：从 LLM 到 Skill / MCP / RAG](/Agent基本概念梳理/)
