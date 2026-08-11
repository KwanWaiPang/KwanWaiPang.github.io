---
layout: post
title: "什么是LangGraph？"
date:   2026-07-15
tags: [LLM/VLM]
comments: true
author: kwanwaipang
toc: true
excerpt: "从 Graph / State / Node / Edge 讲起，结合 Hello World、生成-评估循环、持久化、人机交互、时间旅行与流式，再到多 Agent 协作与计划执行，说明 LangGraph 解决什么问题、各组件如何配合、怎么把一个 Agent 工作流真正跑起来。"
---


<!-- * 目录
{:toc} -->


# 引言

大模型应用开发大致经历了几层能力叠加：

1. **Prompt**：一次问答；
2. **Chain（链）**：把多步调用按顺序串起来；
3. **Agent**：模型可以决定是否调用工具，并据结果继续推理；
4. 更复杂的业务还需要：**循环重试、跨步骤状态、条件分支、执行中暂停等人确认**。

真实业务很少是一条笔直的单行道。例如：

* **循环与迭代**：Agent 生成代码后跑测试，失败则返回修改，直到通过；
* **状态维护**：多步任务中，后一步必须读到前一步的中间结果、变量与上下文；
* **人机协同**：发邮件、改数据、发布报告等操作，需要在执行前暂停，等待人工确认或修改；
* **多角色协作**：检索、写代码、画图等能力由不同「助手」接力完成。

线性 Chain（以及许多只支持 DAG 的编排）不太擅长这类「有环、有状态、可中断」的流程。LangChain 生态中的 **LangGraph**，就是用来编排这类工作流的框架：用**图**描述步骤与走向，用**共享状态**在步骤间传递数据，并原生支持循环、持久化与断点。

本文按「要解决什么问题 → 四个核心组件 → 最小可运行示例 → 循环与持久化 → 人机交互 → 两个复杂案例」展开，便于先建立整体图景，再按需深入。部分例子与讲解脉络参考了公开课程[《从零吃透 LangGraph 全套实战》](https://www.bilibili.com/video/BV12hJM6XEHS/)，表述为本人整理与改写。

相关前文：

* [什么是Agent？：从 LLM 到 Skill / MCP / RAG](/Agent基本概念梳理/)


# 一句话理解 LangGraph

可以先记住：

~~~
LangGraph 用「图」编排 LLM / Agent 工作流：
节点执行具体步骤，边决定下一步走向，
State 在节点之间共享上下文。
它与 LangChain 互补：后者提供模型、提示词、工具等组件，
前者负责把这些组件组织成可循环、可分支、可中断的流程。
~~~

四个名词：

* **Graph（图）**：整张工作流；
* **Node（节点）**：一步计算——调用模型、执行工具、做数据处理等；
* **Edge（边）**：节点之间的转移；普通边固定跳转，条件边由路由函数决定；
* **State（状态）**：全图共享的数据；每个节点可读，并通过返回值更新。

持久化时，框架会把 State 的快照存成 **Checkpoint（检查点）**。也可以把它理解成游戏存档：执行到某一步留下快照，下次用同一会话标识继续。


# LangGraph 和 LangChain 是什么关系？

二者是**互补**，不是互相替代：

| 维度 | LangChain（含 LCEL） | LangGraph |
|---|---|---|
| **定位** | 组件与链式拼装 | 状态化、可循环的工作流编排 |
| **控制流** | 偏线性或 DAG | 支持循环、条件分支、回跳 |
| **状态** | 多需开发者自行传递 | 内置全局 State，可用 Reducer 合并更新 |
| **人机交互** | 需自行拼装中断逻辑 | 支持在节点前/后设置断点 |
| **持久化** | 常见于聊天历史等局部能力 | Checkpointer 保存整图执行快照 |
| **时间旅行** | 一般不支持 | 可回溯历史快照，并从某一步分叉重跑 |
| **流式输出** | 有，偏模型侧 | 支持节点级与 Token 级等多种流式模式 |
| **组合方式** | Model、Prompt、Tool、Parser 等 | 节点内可直接使用 LCEL / Runnable |

一句话：**LangChain 提供组件，LangGraph 负责把组件编排成可运行的图。**

也可以记成：LangChain 是工具箱里的零件；LangGraph 是把零件组装成可循环、可交互、可恢复机器的控制中枢。


# 先看一张总览图

先看最小可用形态：用户任务进入图之后，Agent 节点与 LLM、工具节点配合，State 全程共享。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart TB
    classDef userCls fill:#FFF3E0,stroke:#E65100,color:#222
    classDef runtimeCls fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef modelCls fill:#F3E5F5,stroke:#6A1B9A,color:#222
    classDef toolCls fill:#E8F5E9,stroke:#2E7D32,color:#222
    classDef stateCls fill:#FFF8E1,stroke:#F9A825,color:#222
    classDef endCls fill:#FFCDD2,stroke:#C62828,color:#222

    U["用户任务"] --> RT["LangGraph 运行时"]
    RT --- ST["State / Checkpoint"]
    RT --> AG["Agent 节点"]
    AG -->|"请求 / 回复"| LM["LLM"]
    AG -->|"条件边：需要工具"| TN["Tool 节点"]
    TN --> EXT["搜索 / 代码执行 / API"]
    EXT --> TN
    TN -->|"普通边：结果回填"| AG
    AG -->|"条件边：可以结束"| ED["END"]

    class U userCls
    class RT,AG runtimeCls
    class LM modelCls
    class TN,EXT toolCls
    class ST stateCls
    class ED endCls
</div>

<p align="center"><em>图 1：用户任务、运行时、State、Agent 节点、Tool 节点与 LLM 的关系</em></p>


# 核心组件：Graph、State、Node、Edge

入门抓住这四块即可；后面的示例都建立在它们之上。


## 1. Graph：工作流本身

最常用的是 **`StateGraph`**：带共享状态的图。  
另有偏聊天场景的 `MessageGraph`；一般业务更常从 `StateGraph` 开始。

构建步骤通常是：

1. `StateGraph(状态类型)` 创建图；
2. `add_node` 添加节点；
3. 设置入口（`set_entry_point` 或从 `START` 连边），再添加普通边 / 条件边；
4. `compile(...)` 编译为可 `invoke` / `stream` 的对象。

编译会把节点、边、检查点，以及可选的观测集成（例如 LangSmith）组装成可执行对象。因此代码里写的步骤不多，运行时仍具备较完整的编排能力——编译产物在使用方式上接近 LCEL 的 Runnable。

> **NOTE：**  
> 接入私有或国产模型时，通常只需替换创建 LLM 的那一层（与 LangChain 换模型的方式相同），图结构本身往往不必重写。也要注意 LangChain / LangGraph 版本匹配，否则容易出现依赖或序列化告警。


## 2. State：节点之间共享的数据

State 是整张图的共享数据，常见定义方式：

* `TypedDict` / Pydantic 模型；
* 官方 **`MessagesState`**（专门传递 `HumanMessage`、`AIMessage`、`ToolMessage` 等）。

需要记住三点：

1. **全图共享**，不是每个节点各有一份互不相通的私有字典；
2. **节点通过返回值更新 State**。例如 `return {"messages": [...]}`，框架负责合并；
3. **合并规则由 Reducer（归约函数）决定**。默认可能覆盖；消息列表常用 `Annotated[list, add_messages]` 或 `operator.add`，以免后一步冲掉前一步消息。

可以把 State 看成「随流程向下传递的上下文」：工具结果、模型输出、路由所需字段都放在里面；`invoke` 结束后拿到的结果，通常也来自最终 State。运行本质可以概括为：**不断 reduce state，最后从 state 取结果。**

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
    classDef nCls fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef sCls fill:#FFF8E1,stroke:#F9A825,color:#222

    S0["State v0"] --> N1["节点 1"]
    N1 -->|"返回局部更新"| R1["Reducer 合并"]
    R1 --> S1["State v1"]
    S1 --> N2["节点 2"]
    N2 -->|"返回局部更新"| R2["Reducer 合并"]
    R2 --> S2["State v2"]

    class N1,N2 nCls
    class S0,S1,S2,R1,R2 sCls
</div>

<p align="center"><em>图 2：节点返回更新，经 Reducer 合并后形成新的 State</em></p>

若除消息外还要传业务字段（例如发送者 `sender`、计划列表 `plan`），可自定义 `AgentState`；纯对话场景优先用 `MessagesState`。

下面是一个**不接 LLM** 的小例子，专门帮助建立「Reducer 如何合并」的直觉：

~~~python
from typing import Annotated, TypedDict
import operator
from langgraph.graph import StateGraph, START, END

class DemoState(TypedDict):
    foo: int
    # 列表字段用 operator.add 追加，而不是整段覆盖
    tags: Annotated[list, operator.add]

def step_a(state: DemoState):
    return {"foo": 1, "tags": ["a"]}

def step_b(state: DemoState):
    # 只返回要改的字段；foo 覆盖，tags 追加
    return {"foo": 2, "tags": ["b"]}

g = StateGraph(DemoState)
g.add_node("a", step_a)
g.add_node("b", step_b)
g.add_edge(START, "a")
g.add_edge("a", "b")
g.add_edge("b", END)
print(g.compile().invoke({"foo": 0, "tags": []}))
# 大致得到：{"foo": 2, "tags": ["a", "b"]}
~~~


## 3. Node：执行步骤的函数

节点本质上是**接收当前 State、返回状态更新的函数**：

~~~python
def call_model(state: MessagesState):
    response = model.invoke(state["messages"])
    return {"messages": [response]}
~~~

常见几类：

| 类型 | 作用 |
|---|---|
| **普通节点** | 业务函数：调模型、整理数据、写回结果 |
| **入口 / 起始** | 指定图从哪里开始；缺少入口则无法执行 |
| **结束节点 `END`** | 框架提供的终点，任务完成时指向它 |

工具场景还有 **`ToolNode`**。工具一般是「列表 + 结构化调用结果」，框架需要解析模型返回的 tool calls 并派发执行，因此不建议把工具列表当成普通函数节点直接挂上。常见分工是：

* 模型节点：普通函数 + `bind_tools(...)`；
* 工具节点：`ToolNode(tools)`。

> **NOTE：**  
> 节点本身不持有私有状态；状态属于整张图。节点产出的结果，通过返回值进入共享 State。悬空边、缺少入口等会在 `compile` 阶段报错，属于常见入门坑。


## 4. Edge：下一步去哪里

边主要分这些情况：

1. **普通边**：A 结束后固定到 B；
2. **条件边**：由**路由函数**读取 State，决定下一个节点（或 `END`）；
3. **入口点**：从 `START` 指向第一个业务节点；
4. **条件入口点**：启动时就要在多个入口之间选择（机制与条件边类似，作用位置在入口）。

Hello World 里最常见的路由是：

* 模型输出包含 tool calls → 走向 `tools`；
* 否则 → 走向 `END`。

条件边返回的通常是**节点名字符串**，并需要在 `path_map`（`add_conditional_edges` 的第三个参数）里登记好去向。一个节点可以有多条出边。多 Agent 场景里，还常根据「是谁把流程送进工具节点的」（如 `sender`）决定工具执行完后回到哪条路径。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
    classDef nCls fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef toolCls fill:#E8F5E9,stroke:#2E7D32,color:#222
    classDef endCls fill:#FFCDD2,stroke:#C62828,color:#222

    ST((START)) --> AG["Agent 节点"]
    AG -->|"条件边：需要工具"| TL["Tools 节点"]
    AG -->|"条件边：直接回答"| ED((END))
    TL -->|"普通边：结果回填"| AG

    class AG nCls
    class TL toolCls
    class ED endCls
</div>

<p align="center"><em>图 3：最小循环——Agent 与 Tools 往返，或 Agent 直接结束</em></p>


# 搭一个最小应用：天气查询 Hello World

下面以「查询上海天气」为例，把完整开发流程按同一顺序串一遍。演示里可以用简化假工具（文本是否包含「上海」），重点在于把 **Agent ↔ Tools 闭环**跑通。


## 开发顺序

1. **定义工具**：用 `@tool` 包装函数；
2. **组成工具列表**：`tools = [...]`；
3. **绑定模型**：`model.bind_tools(tools)`，使模型能发出结构化工具调用；
4. **创建工具节点**：`ToolNode(tools)`；
5. **编写模型节点**：如 `call_model`；
6. **编写路由函数**：如 `should_continue`，在 `tools` 与 `END` 之间选择；
7. **组图**：`StateGraph` → `add_node` → 入口 → 条件边 / 普通边；
8. **编译运行**：`compile(checkpointer=MemorySaver())`，再 `invoke` 或 `stream`；用 `thread_id` 区分会话。


## 关键代码骨架

~~~python
from langchain_core.tools import tool
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

@tool
def search(query: str) -> str:
    """假搜索：演示用。真实项目可换成天气 API / Tavily 等。"""
    if "上海" in query:
        return "上海今天大约 30°C，晴。"
    return "暂无该城市天气数据。"

tools = [search]
# model = ChatOpenAI(...).bind_tools(tools)  # 按你的模型接入方式替换
tool_node = ToolNode(tools)

def call_model(state: MessagesState):
    response = model.invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state: MessagesState):
    last = state["messages"][-1]
    if getattr(last, "tool_calls", None):
        return "tools"
    return END

workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {"tools": "tools", END: END},
)
workflow.add_edge("tools", "agent")

app = workflow.compile(checkpointer=MemorySaver())
config = {"configurable": {"thread_id": "demo-1"}}

# 第一问：触发工具
app.invoke({"messages": [("user", "上海天气怎么样？")]}, config=config)
# 第二问：同一 thread_id，应仍记得刚问的是上海
app.invoke({"messages": [("user", "我刚才问的是哪个城市？")]}, config=config)
~~~

验证时通常看两件事：

1. 第一问能匹配到工具并返回天气相关结果；
2. 同一 `thread_id` 下再问「我刚才问的是哪个城市？」，仍能结合上下文回答——这依赖 **State + Checkpointer**。

调试时还可以用图可视化（如 `get_graph` 一类能力）核对节点与边是否连对，或用 LangSmith 看真实调用链。

> **NOTE：**  
> 低代码 / 拖拽式 Agent 工作流，编排思想与此类图类似。流程简单时拖拽更省事；需要细粒度控制、复杂分支或多 Agent 协作时，用代码编写 LangGraph 通常更合适。Agent 也未必只绑一个模型：不同节点可以接不同模型与工具。


# 先体会循环：生成 → 评估 → 修改

Hello World 已经有「Agent ↔ Tools」环。再看一个**不依赖外部工具**的小循环，专门体会条件边如何把流程打回去——这也是许多「自我反思 / 纠错」Agent 的雏形。

## 场景

1. **生成节点（Generator）**：根据用户问题生成解答；若已有反馈，则按反馈修改；
2. **评估节点（Evaluator）**：审查是否合格；不合格则写反馈并退回；
3. **条件路由**：通过则结束，否则回到生成节点。

## 代码

~~~python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class AgentState(TypedDict):
    query: str
    response: str
    feedback: str
    revision_count: int

def generator_node(state: AgentState):
    count = state.get("revision_count", 0)
    query = state["query"]
    if count == 0:
        response = (
            f"【初步解答】针对问题「{query}」，"
            "推荐使用 LangGraph，因为它支持循环图和状态保持。"
        )
    else:
        response = (
            f"【修改版解答】针对问题「{query}」，"
            f"结合反馈（{state['feedback']}），补充："
            "内置持久化、人机协同与时间旅行等生产级能力。"
        )
    return {"response": response, "revision_count": count + 1}

def evaluator_node(state: AgentState):
    # 演示：第一轮不通过，第二轮通过
    if state["revision_count"] < 2:
        return {"feedback": "内容太简短，请补充 LangGraph 的特色功能。"}
    return {"feedback": "approved"}

def route_decision(state: AgentState):
    return "end" if state["feedback"] == "approved" else "regenerate"

workflow = StateGraph(AgentState)
workflow.add_node("generator", generator_node)
workflow.add_node("evaluator", evaluator_node)
workflow.add_edge(START, "generator")
workflow.add_edge("generator", "evaluator")
workflow.add_conditional_edges(
    "evaluator",
    route_decision,
    {"end": END, "regenerate": "generator"},
)
app = workflow.compile()
result = app.invoke({"query": "为什么选择 LangGraph？", "revision_count": 0})
print(result["revision_count"], result["feedback"], result["response"])
~~~

## 运行机制

1. 从 `START` 进入 `generator`，写出初步解答，`revision_count = 1`；
2. 进入 `evaluator`，因轮次不足返回修改意见；
3. 路由函数读到未通过，把流程送回 `generator`；
4. 第二次生成结合反馈写出修改版，`revision_count = 2`；
5. 再次评估通过，路由到 `END`。

这就是「有环」的价值：把「不够好就再来一次」写进图结构，而不是靠外层 `while` 手搓。


# 进阶能力一：持久化（Checkpoint）

State 解决「同一次图执行中数据如何传递」；**Checkpointer** 解决「跨多次调用如何保存与恢复快照」。

可以把 Checkpoint 理解成**游戏关卡存档**：

* 图每完成一个关键步骤（super-step），写入一份状态快照；
* 之后使用相同 `thread_id` 调用，可在已有状态上继续；
* 更换 `thread_id`，即开启另一条互不干扰的会话。

需要区分：

| | Message History（聊天历史） | Checkpoint |
|---|---|---|
| **保存对象** | 多偏对话消息 | **整图执行状态快照**（含节点链路中的业务字段） |
| **典型用途** | 多轮闲聊上下文 | 恢复执行、多轮 Agent、调试回溯 |

常见实现：

* **`MemorySaver`**：保存在进程内存，适合本地调试；
* **`SqliteSaver`（及异步版本）**：落到 SQLite，适合需要落盘的场景；
* **自定义**：官方提供基类扩展点；若要接到 Redis 等，需自行实现序列化与读写。

使用方式通常是在编译时注入：

~~~python
from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

# 同一 thread：记得上文
app.invoke(input1, config={"configurable": {"thread_id": "u-42"}})
app.invoke(input2, config={"configurable": {"thread_id": "u-42"}})

# 换一个 thread：互不干扰
app.invoke(input3, config={"configurable": {"thread_id": "u-99"}})
~~~

调试时可用 `stream` 按事件输出中间结果，观察每一步 State 的变化（例如 `stream_mode="updates"` / `"values"`，以当前版本文档为准）。


# 进阶能力二：人机交互（Human-in-the-Loop）

当某一步必须由人决定时，可在编译阶段设置断点，例如 `interrupt_before=["某个节点"]`：

1. 图执行到该节点前暂停；
2. 应用层向用户展示选项（如 yes/no，或客服式的 1/2/3）；
3. 用户确认后，用**同一 `config`（含 `thread_id`）**再次 `invoke` / `stream`，从断点继续；
4. 若用户拒绝，则走取消或结束路径，不再执行后续节点。

这与电话客服「按键后才进入下一流程」类似：模型负责推进，人负责关键确认。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
    classDef nCls fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef humanCls fill:#FFF3E0,stroke:#E65100,color:#222
    classDef endCls fill:#FFCDD2,stroke:#C62828,color:#222

    A["步骤 1"] --> B["步骤 2"]
    B --> I{"interrupt_before<br/>步骤 3"}
    I -->|"用户确认：继续"| C["步骤 3"]
    I -->|"用户取消"| E1((END))
    C --> E2((END))

    class A,B,C nCls
    class I humanCls
    class E1,E2 endCls
</div>

<p align="center"><em>图 4：在指定节点前暂停，等待用户确认或取消</em></p>

人在断点处常见三种动作：

1. **批准（Approve）**：不改状态，直接继续；
2. **编辑（Edit）**：修改 State 中的关键字段（如 SQL、邮件正文）后再继续；
3. **反馈（Feedback）**：写入提示，让 Agent 重新思考。

适用场景包括：自动发送邮件、执行转账或删除、报告发布前人工审阅、旅行方案确认等。断点按**节点名**配置，一张图可设置多处。

> **NOTE：**  
> 控制台 `input()` 只是演示续跑姿势；线上系统通常由前端/API 收集用户选择，再带着同一 `thread_id` 触发续执行。


# 进阶能力三：时间旅行与流式输出

这两项和 Checkpoint 关系密切，也是生产调试时很实用的能力。

## 时间旅行（Time-Travel）

有了每一步的完整快照，就可以：

* **回溯（Rewind）**：查看 Agent 在过去某一步的完整 State；
* **分叉（Fork）**：回到某一步，修改状态，再走出一条不同路径。

这对「复现一次错误决策」「对比两种提示词」非常有用——不必从第一步重新烧 Token。

## 流式输出（Streaming）

LangGraph 支持多种粒度：

* **节点级**：某个节点执行完，立刻推送状态变化；
* **Token 级**：流式推送 LLM 吐出的每个字符；
* **更新 / 全量**：例如 `stream_mode="updates"` 看增量，`"values"` 看完整 State（以当前文档为准）。

入门阶段可先用节点级 `stream` 看清「图现在走到哪」；产品交互再叠加 Token 流。


# 复杂案例一：多 Agent 协作

Hello World 只有一个 Agent 节点。更复杂的需求往往需要**多个角色分工，并在角色之间交接状态**。

一个典型需求可以概括为：

> 根据近五年 AI 软件市场规模，生成一张曲线图。

至少拆成两个 Agent：

1. **Research Agent**：用搜索工具（如 Tavily）检索公开数据；
2. **Chart Agent**：整理成可绘制的数据，并生成 / 执行绘图代码（示例中通过 Python REPL 执行模型生成的代码）。

流程示意：

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart TB
    classDef userCls fill:#FFF3E0,stroke:#E65100,color:#222
    classDef agentCls fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef toolCls fill:#E8F5E9,stroke:#2E7D32,color:#222
    classDef endCls fill:#FFCDD2,stroke:#C62828,color:#222

    U["用户：近五年市场规模曲线"] --> R["Research Agent"]
    R -->|"调用"| S["搜索工具"]
    S -->|"返回结果"| R
    R -->|"交接数据"| C["Chart Agent"]
    C -->|"生成并执行代码"| P["Python REPL / 绘图"]
    P -->|"需要修正则重试"| C
    C -->|"得到最终结果"| E1((END))
    R -->|"超过步数仍无结果"| E2((END))

    class U userCls
    class R,C agentCls
    class S,P toolCls
    class E1,E2 endCls
</div>

<p align="center"><em>图 5：Research 与 Chart 协作，工具调用可循环，并设置步数上限</em></p>

实现时常见要点：

1. **动态创建 Agent / 节点**：角色变多后，用工厂函数按「模型 + 工具 + 提示词」创建，避免大量重复代码；常用 `functools.partial` 把同一套节点逻辑参数化挂到图上；
2. **提示词写明多助手协作**：例如说明当前只是助手之一、无法独立完成时可交其他助手、出现最终交付物（如约定关键字 `FINAL ANSWER`）则停止；
3. **自定义 State**：除消息外增加 `sender` 等字段，供条件边判断控制权应回到谁；消息字段用 `operator.add` / `add_messages` 追加；
4. **共享 ToolNode，按来源回边**：工具节点可以共用，但结束后要根据进入时的 `sender`（或 path_map）决定回到 Research 还是 Chart；
5. **限制递归 / 步数**：设置 `recursion_limit`，避免搜索或代码生成陷入死循环、持续消耗 Token。

多 Agent 的难点通常不在「多复制几个 Hello World」，而在：

~~~
协作约定（写进 system prompt）
+ 动态节点（工厂 / partial）
+ 按 sender 回边（条件路由）
~~~

> **NOTE：**  
> 用 REPL 执行模型生成的代码，适合演示「代码也可作为工具」。若用于生产，需要沙箱隔离、权限控制和审计，不能直接照搬演示写法。


# 复杂案例二：计划执行（Plan-and-Execute）

多 Agent 侧重角色分工；计划执行侧重**把大任务拆成有依赖的小步骤，并在执行中修正计划**。它与 ReAct（Reason + Act）同属「边推理边行动」一类方法。

基本循环：

1. **Plan**：把目标拆成步骤列表；
2. **Execute**：逐步调用工具执行；
3. **Replan**：某步失败、结果不可用或偏离原目标时，结合「原计划 + 已完成步骤」重新规划；
4. 得到最终答案，或达到循环上限后结束。

示例问题：

> 2024 年巴黎奥运会 100 米自由泳冠军的家乡在哪里？

表面是一问，实际至少包括：

1. 查出冠军是谁；
2. 再查其家乡；
3. 按要求整理输出（例如中文回答）。

步骤有先后依赖：冠军错了，家乡也必然错，因此需要分步执行与必要时重规划。

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart LR
    classDef planCls fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef actCls fill:#E8F5E9,stroke:#2E7D32,color:#222
    classDef repCls fill:#FFF8E1,stroke:#F9A825,color:#222
    classDef endCls fill:#FFCDD2,stroke:#C62828,color:#222

    P["Planner<br/>生成计划"] --> A["Executor<br/>逐步执行"]
    A --> J{"是否已有最终答案"}
    J -->|"否"| R["Replan<br/>对照原目标调整"]
    R --> A
    J -->|"是"| E1((END))
    A -->|"超过步数上限"| E2((END))

    class P planCls
    class A actCls
    class R,J repCls
    class E1,E2 endCls
</div>

<p align="center"><em>图 6：计划 → 执行 → 必要时再计划，直到完成或达到步数上限</em></p>

实现上通常包括：

* **状态字段**：目标（`input`）、计划列表（`plan`）、已执行步骤（`past_steps`）、最终响应（`response`）；
* **Planner**：根据目标生成步骤（提示词可约束「不要多余步骤，最后一步应给出最终答案」）；
* **Executor**：按步调用工具（如网络搜索）；也可复用社区里的 ReAct 执行模板（如 LangChain Hub 中的相关 prompt）；
* **Replan 提示词**：写明原计划、当前进度与约束，降低跑偏和幻觉——重点是**对齐原目标**，而不是无限发散新任务；
* **结束路由**（如 `should_end`）：有最终答案则结束，否则继续循环；
* **`recursion_limit`**：为计划/重规划环设上限。

> **NOTE：**  
> 循环会增加模型调用次数与 Token 消耗；也无法单靠循环消除幻觉。工程上常配合更明确的提示词、关键结果校验、多次生成对比，以及对稳定结果做缓存。若某步必须由人确认，可再叠加上一节的断点。


# 实践中容易忽略的几点

薄入门文常停在「两个节点 + `invoke`」。结合上面例子，下面几条值得单独勾一下：

1. **工具必须走 `ToolNode`**，不要把工具列表当成普通函数节点硬挂；
2. **条件边返回节点名**，并在 path map 里登记完整；
3. **消息字段用 Reducer 追加**，避免后一步覆盖前一步对话；
4. **Checkpoint ≠ 仅聊天历史**：它保存的是整图状态快照；`thread_id` 是会话隔离键；
5. **`compile` 一身多职**：Runnable + checkpointer + interrupt + 可观测注入；
6. **HITL 续跑要用同一 config**，否则等于开了新会话；
7. **有环必设 `recursion_limit`**，尤其是工具环与 replan 环；
8. **多 Agent 的关键是协作约定 + 动态节点 + 回边身份**，不是复制粘贴；
9. **图可视化 / LangSmith** 往往比只盯最终 `invoke` 返回值更省排查时间；
10. **敏感副作用节点前加 `interrupt_before`**，比事后补救便宜。


# 选型与学习顺序

若按由浅入深来学，可以参考下面顺序：

<div class="mermaid" style="display: flex; justify-content: center; width: 100%; margin: 0 auto;">
flowchart BT
    classDef baseCls fill:#ECEFF1,stroke:#455A64,color:#222
    classDef midCls fill:#E3F2FD,stroke:#1565C0,color:#222
    classDef advCls fill:#FFF3E0,stroke:#EF6C00,color:#222

    P1["1. 四个组件<br/>Graph / State / Node / Edge"] --> P2["2. Hello World<br/>工具调用闭环 + thread_id"]
    P2 --> P3["3. 简单循环<br/>生成-评估-修改"]
    P3 --> P4["4. Checkpointer<br/>MemorySaver / SQLite"]
    P4 --> P5["5. Human-in-the-loop<br/>interrupt_before"]
    P5 --> P6["6. 多 Agent 协作<br/>动态节点与路由"]
    P6 --> P7["7. 计划执行<br/>Plan / Act / Replan"]

    class P1,P2,P3 baseCls
    class P4,P5 midCls
    class P6,P7 advCls
</div>

<p align="center"><em>图 7：由浅入深的学习顺序</em></p>

选型可以按任务特征判断：

* 流程稳定、分支少 → Chain 或低代码工作流可能足够；
* 需要循环纠错、细粒度状态、人工审批 → 更适合 LangGraph；
* 多角色分工、动态创建能力 → 多 Agent 图；
* 目标复杂、步骤有依赖、需要边做边改 → 计划执行类图；
* 需要复现某次决策、对比分支 → 善用 Checkpoint + 时间旅行。

下一步可直接阅读官方 Tutorials（RAG Agent、SQL Agent、Plan-and-Execute 等），或按业务扩展自定义 `BaseCheckpointSaver`、子图与长期记忆 Store——那些属于进阶专题，本文不再展开。


# 总结

| 概念 | 一句话 |
|---|---|
| **LangGraph** | 用图编排状态化、可循环的 LLM / Agent 工作流 |
| **Graph** | 工作流本身；常用 `StateGraph`，编译后运行 |
| **State** | 全图共享数据；用 Reducer 合并更新 |
| **Node** | 执行步骤的函数；工具侧常用 `ToolNode` |
| **Edge** | 控制下一步；条件边依赖路由函数 |
| **Checkpoint** | 执行快照，支撑多轮会话、恢复与时间旅行 |
| **Human-in-the-loop** | 在节点前暂停，等待人工确认 / 编辑 / 反馈 |
| **Streaming** | 节点级或 Token 级观察执行过程 |
| **多 Agent** | 多角色分工、状态交接与动态路由 |
| **计划执行** | 拆计划 → 执行 → 必要时再计划 |

再压缩成一句：

~~~
不确定的判断交给模型；
流程控制、状态保存、中断与多角色协作交给图与运行时。
LangGraph 把后者整理成可复用的编排结构。
~~~


# 参考资料

* [LangGraph 官方文档](https://langchain-ai.github.io/langgraph/)
* [LangGraph GitHub](https://github.com/langchain-ai/langgraph)
* [LangChain Blog](https://blog.langchain.dev/)
* 公开课程：[从零吃透 LangGraph 全套实战（BV12hJM6XEHS）](https://www.bilibili.com/video/BV12hJM6XEHS/)（部分例子参考，本文为改写）
* 前文：[什么是Agent？：从 LLM 到 Skill / MCP / RAG](/Agent基本概念梳理/)
