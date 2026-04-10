"use client";

import { useMemo, useState } from "react";

type TaskStatus = "todo" | "in_progress" | "done";

type FollowUpItem = {
  at: string;
  note: string;
};

type WorkTask = {
  id: string;
  title: string;
  status: TaskStatus;
  progress: number;
  dueDate: string;
  summary: string;
  nextAction: string;
  followUps: FollowUpItem[];
};

type TaskDraft = {
  title: string;
  dueDate: string;
  summary: string;
  nextAction: string;
};

type FollowUpDraft = {
  progress: string;
  note: string;
};

const initialTasks: WorkTask[] = [
  {
    id: "WK-101",
    title: "季度经营复盘材料整理",
    status: "in_progress",
    progress: 68,
    dueDate: "2026-04-18",
    summary: "整合业务指标与项目进度，输出管理复盘版面。",
    nextAction: "补齐销售漏斗数据，并整理本周风险项。",
    followUps: [
      { at: "04-08 09:30", note: "确认复盘模板结构，开始汇总指标。" },
      { at: "04-09 14:20", note: "项目里程碑已补全，风险页待继续完善。" },
    ],
  },
  {
    id: "WK-102",
    title: "客户交付流程标准化",
    status: "in_progress",
    progress: 82,
    dueDate: "2026-04-15",
    summary: "统一交付清单、验收节奏和异常升级路径。",
    nextAction: "完成 SOP 终版整理，并检查缺失环节。",
    followUps: [
      { at: "04-07 11:10", note: "交付 checklist 第一版已完成。" },
      { at: "04-09 18:05", note: "补充高风险客户的升级规则。" },
    ],
  },
  {
    id: "WK-103",
    title: "企业知识库权限梳理",
    status: "todo",
    progress: 0,
    dueDate: "2026-04-22",
    summary: "重新梳理文档权限，控制敏感内容访问范围。",
    nextAction: "输出权限矩阵，并确认例外审批规则。",
    followUps: [{ at: "04-10 10:00", note: "已登记事项，等待开始跟进。" }],
  },
  {
    id: "WK-104",
    title: "供应商合同续签跟进",
    status: "done",
    progress: 100,
    dueDate: "2026-04-12",
    summary: "完成年度续签谈判并更新服务条款。",
    nextAction: "已完成，等待归档。",
    followUps: [
      { at: "04-06 16:40", note: "价格条款确认，进入签署流程。" },
      { at: "04-10 09:15", note: "签署完成，已进入归档。" },
    ],
  },
];

const statusMeta: Record<TaskStatus, { label: string; tone: string; panelTone: string }> = {
  todo: {
    label: "新建",
    tone: "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)]",
    panelTone: "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]",
  },
  in_progress: {
    label: "跟进中",
    tone: "border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] text-[var(--gold)]",
    panelTone: "border-[rgba(214,179,106,0.22)] bg-[rgba(214,179,106,0.07)]",
  },
  done: {
    label: "已完成",
    tone: "border-[rgba(134,239,172,0.18)] bg-[rgba(134,239,172,0.08)] text-emerald-200",
    panelTone: "border-[rgba(134,239,172,0.22)] bg-[rgba(134,239,172,0.06)]",
  },
};

const statusOrder: Record<TaskStatus, number> = {
  todo: 0,
  in_progress: 1,
  done: 2,
};

export default function WorkBoard() {
  const [taskItems, setTaskItems] = useState(initialTasks);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [selectedTaskId, setSelectedTaskId] = useState(initialTasks[0]?.id ?? "");
  const [isCreating, setIsCreating] = useState(false);
  const [followUpTaskId, setFollowUpTaskId] = useState("");
  const [draft, setDraft] = useState<TaskDraft>({
    title: "",
    dueDate: "",
    summary: "",
    nextAction: "",
  });
  const [followUpDraft, setFollowUpDraft] = useState<FollowUpDraft>({
    progress: "",
    note: "",
  });
  const [draftError, setDraftError] = useState("");
  const [followUpError, setFollowUpError] = useState("");

  const visibleTasks = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? taskItems
        : taskItems.filter((task) => task.status === statusFilter);

    return [...filtered].sort((left, right) => {
      const statusDifference = statusOrder[left.status] - statusOrder[right.status];

      if (statusDifference !== 0) {
        return statusDifference;
      }

      return left.id.localeCompare(right.id);
    });
  }, [statusFilter, taskItems]);

  const selectedTask =
    visibleTasks.find((task) => task.id === selectedTaskId) ?? visibleTasks[0] ?? taskItems[0];
  const followUpTask = taskItems.find((task) => task.id === followUpTaskId);

  const metrics = {
    todo: taskItems.filter((task) => task.status === "todo").length,
    inProgress: taskItems.filter((task) => task.status === "in_progress").length,
    done: taskItems.filter((task) => task.status === "done").length,
  };

  const isDraftValid =
    Boolean(draft.title.trim()) &&
    Boolean(draft.dueDate) &&
    Boolean(draft.summary.trim()) &&
    Boolean(draft.nextAction.trim());

  function startCreateTask() {
    setIsCreating(true);
    setFollowUpTaskId("");
    setSelectedTaskId("");
    setDraftError("");
    setDraft({
      title: "",
      dueDate: "",
      summary: "",
      nextAction: "",
    });
  }

  function createTask() {
    if (!isDraftValid) {
      setDraftError("请填写完整的事项标题、截止日期、事项说明和下一步动作。");
      return;
    }

    const nextIndex = taskItems.length + 101;
    const newTask: WorkTask = {
      id: `WK-${nextIndex}`,
      title: draft.title.trim(),
      status: "todo",
      progress: 0,
      dueDate: draft.dueDate,
      summary: draft.summary.trim(),
      nextAction: draft.nextAction.trim(),
      followUps: [{ at: "04-10 21:00", note: "事项已创建并录入明细。" }],
    };

    setTaskItems((current) => [newTask, ...current]);
    setSelectedTaskId(newTask.id);
    setStatusFilter("all");
    setIsCreating(false);
    setDraftError("");
  }

  function completeTask(taskId: string) {
    setIsCreating(false);
    setFollowUpTaskId("");
    setTaskItems((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "done",
              progress: 100,
              nextAction: "已完成，等待归档。",
              followUps: [{ at: "04-10 21:12", note: "事项已标记为完成。" }, ...task.followUps],
            }
          : task,
      ),
    );
    setSelectedTaskId(taskId);
  }

  function startFollowUp(task: WorkTask) {
    setIsCreating(false);
    setDraftError("");
    setFollowUpError("");
    setSelectedTaskId(task.id);
    setFollowUpTaskId(task.id);
    setFollowUpDraft({
      progress: String(task.progress > 0 ? task.progress : 10),
      note: "",
    });
  }

  function saveFollowUp() {
    if (!followUpTask) {
      return;
    }

    const parsedProgress = Number(followUpDraft.progress);
    const normalizedProgress = Number.isFinite(parsedProgress) ? Math.max(1, Math.min(99, parsedProgress)) : NaN;

    if (!followUpDraft.note.trim() || Number.isNaN(normalizedProgress)) {
      setFollowUpError("请填写本次跟进说明，并输入 1 到 99 之间的进度。");
      return;
    }

    setTaskItems((current) =>
      current.map((task) =>
        task.id === followUpTask.id
          ? {
              ...task,
              status: "in_progress",
              progress: normalizedProgress,
              nextAction: followUpDraft.note.trim(),
              followUps: [
                {
                  at: "04-10 21:20",
                  note: `进度更新至 ${normalizedProgress}%：${followUpDraft.note.trim()}`,
                },
                ...task.followUps,
              ],
            }
          : task,
      ),
    );
    setSelectedTaskId(followUpTask.id);
    setFollowUpTaskId("");
    setFollowUpDraft({ progress: "", note: "" });
    setFollowUpError("");
  }

  function renderAction(task: WorkTask) {
    if (task.status === "todo") {
      return (
        <button
          type="button"
          onClick={() => startFollowUp(task)}
          className="rounded-full border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] px-4 py-2 text-sm text-[var(--gold)] transition hover:brightness-110"
        >
          开始跟进
        </button>
      );
    }

    if (task.status === "in_progress") {
      return (
        <>
          <button
            type="button"
            onClick={() => startFollowUp(task)}
            className="rounded-full border border-[rgba(214,179,106,0.18)] bg-[rgba(214,179,106,0.08)] px-4 py-2 text-sm text-[var(--gold)] transition hover:brightness-110"
          >
            更新跟进
          </button>
          <button
            type="button"
            onClick={() => completeTask(task.id)}
            className="rounded-full border border-[rgba(134,239,172,0.18)] bg-[rgba(134,239,172,0.08)] px-4 py-2 text-sm text-emerald-200 transition hover:brightness-110"
          >
            标记完成
          </button>
        </>
      );
    }

    return (
      <span className="rounded-full border border-[rgba(134,239,172,0.18)] bg-[rgba(134,239,172,0.08)] px-4 py-2 text-sm text-emerald-200">
        已归档完成
      </span>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="premium-panel rounded-[32px] p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">Admin Workspace</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">事项列表</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              <span className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1">New {metrics.todo}</span>
              <span className="rounded-full border border-[rgba(214,179,106,0.18)] px-3 py-1 text-[var(--gold)]">
                Active {metrics.inProgress}
              </span>
              <span className="rounded-full border border-[rgba(134,239,172,0.18)] px-3 py-1 text-emerald-200">
                Done {metrics.done}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startCreateTask}
              className="rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-105"
            >
              新建事项
            </button>
            {(["all", "todo", "in_progress", "done"] as const).map((status) => {
              const label = status === "all" ? "全部" : statusMeta[status].label;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    statusFilter === status
                      ? "border-[rgba(214,179,106,0.24)] bg-[rgba(214,179,106,0.08)] text-[var(--gold)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {visibleTasks.map((task) => {
            const isActive = selectedTask?.id === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-[26px] border p-5 transition ${statusMeta[task.status].panelTone} ${
                  isActive ? "shadow-[0_18px_40px_rgba(0,0,0,0.25)]" : ""
                }`}
              >
                <button type="button" onClick={() => setSelectedTaskId(task.id)} className="w-full text-left">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusMeta[task.status].tone}`}>
                        {statusMeta[task.status].label}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{task.title}</h3>
                    </div>

                  <div className="text-right text-sm text-[var(--muted)]">
                      <p>进度 {task.progress}%</p>
                      <p>{task.id}</p>
                      <p className="mt-1">截止 {task.dueDate}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[rgba(245,245,242,0.74)]">{task.summary}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                    <div
                      className={`h-full rounded-full ${
                        task.status === "done" ? "bg-emerald-300" : "bg-[var(--gold)]"
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </button>

                <div className="mt-5 flex flex-wrap gap-2">{renderAction(task)}</div>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="premium-panel rounded-[32px] p-6">
        {isCreating ? (
          <>
            <div className="border-b border-[rgba(255,255,255,0.08)] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">Create Task</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">填写事项明细</h2>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">事项标题</span>
                <input
                  value={draft.title}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, title: event.target.value }));
                    setDraftError("");
                  }}
                  className="h-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[rgba(214,179,106,0.28)]"
                  placeholder="例如：整理第二季度重点事项"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">截止日期</span>
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, dueDate: event.target.value }));
                    setDraftError("");
                  }}
                  className="h-12 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[rgba(214,179,106,0.28)]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">事项说明</span>
                <textarea
                  value={draft.summary}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, summary: event.target.value }));
                    setDraftError("");
                  }}
                  className="min-h-28 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[rgba(214,179,106,0.28)]"
                  placeholder="写清楚这件事要做什么。"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">下一步动作</span>
                <textarea
                  value={draft.nextAction}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, nextAction: event.target.value }));
                    setDraftError("");
                  }}
                  className="min-h-24 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[rgba(214,179,106,0.28)]"
                  placeholder="写下一步准备怎么推进。"
                />
              </label>
            </div>

            {draftError ? <p className="mt-4 text-sm text-[var(--gold)]">{draftError}</p> : null}

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={createTask}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  isDraftValid
                    ? "bg-[var(--gold)] text-black hover:brightness-105"
                    : "cursor-not-allowed bg-[rgba(255,255,255,0.08)] text-[var(--muted)]"
                }`}
              >
                保存事项
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setSelectedTaskId(taskItems[0]?.id ?? "");
                }}
                className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-2.5 text-sm text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
              >
                取消
              </button>
            </div>
          </>
        ) : followUpTask ? (
          <>
            <div className="border-b border-[rgba(255,255,255,0.08)] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">Follow Up</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">补充跟进信息</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">{followUpTask.title}</p>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">当前进度</span>
                <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[var(--muted)]">左右拖动设置进度</span>
                    <span className="font-medium text-[var(--foreground)]">{followUpDraft.progress || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="99"
                    value={followUpDraft.progress || "1"}
                    onChange={(event) => {
                      setFollowUpDraft((current) => ({ ...current, progress: event.target.value }));
                      setFollowUpError("");
                    }}
                    className="mt-4 h-2 w-full cursor-ew-resize appearance-none rounded-full bg-transparent accent-[var(--gold)]"
                  />
                </div>
              </label>

              <div className="rounded-[24px] border border-[rgba(214,179,106,0.14)] bg-[rgba(214,179,106,0.05)] p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[var(--muted)]">预览进度</span>
                  <span className="font-medium text-[var(--foreground)]">{followUpDraft.progress || 0}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                  <div
                    className="h-full rounded-full bg-[var(--gold)]"
                    style={{
                      width: `${Math.max(0, Math.min(99, Number(followUpDraft.progress) || 0))}%`,
                    }}
                  />
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">本次跟进说明</span>
                <textarea
                  value={followUpDraft.note}
                  onChange={(event) => {
                    setFollowUpDraft((current) => ({ ...current, note: event.target.value }));
                    setFollowUpError("");
                  }}
                  className="min-h-28 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[rgba(214,179,106,0.28)]"
                  placeholder="写清楚这次已经推进了什么，还剩什么。"
                />
              </label>
            </div>

            {followUpError ? <p className="mt-4 text-sm text-[var(--gold)]">{followUpError}</p> : null}

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveFollowUp}
                className="rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-105"
              >
                保存跟进
              </button>
              <button
                type="button"
                onClick={() => {
                  setFollowUpTaskId("");
                  setFollowUpError("");
                }}
                className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-2.5 text-sm text-[var(--foreground)] transition hover:border-[rgba(214,179,106,0.24)] hover:text-[var(--gold)]"
              >
                取消
              </button>
            </div>
          </>
        ) : selectedTask ? (
          <>
            <div className="border-b border-[rgba(255,255,255,0.08)] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">Task Detail</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{selectedTask.title}</h2>
              <div className="mt-4">
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusMeta[selectedTask.status].tone}`}>
                  {statusMeta[selectedTask.status].label}
                </span>
              </div>
              <div className="mt-4 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[var(--muted)]">当前进度</span>
                  <span className="font-medium text-[var(--foreground)]">{selectedTask.progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                  <div
                    className={`h-full rounded-full ${
                      selectedTask.status === "done" ? "bg-emerald-300" : "bg-[var(--gold)]"
                    }`}
                    style={{ width: `${selectedTask.progress}%` }}
                  />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">{renderAction(selectedTask)}</div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">下一步</p>
                <p className="mt-3 text-sm leading-7 text-[rgba(245,245,242,0.78)]">{selectedTask.nextAction}</p>
              </div>

              <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">到期时间</p>
                <p className="mt-3 text-sm leading-7 text-[rgba(245,245,242,0.78)]">{selectedTask.dueDate}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">跟进记录</h3>
                <span className="text-sm text-[var(--muted)]">{selectedTask.followUps.length} 条更新</span>
              </div>

              <div className="mt-4 space-y-3">
                {selectedTask.followUps.map((item, index) => (
                  <div
                    key={`${selectedTask.id}-${index}-${item.at}`}
                    className="rounded-[22px] border border-[rgba(214,179,106,0.12)] bg-[rgba(214,179,106,0.06)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-medium text-[var(--foreground)]">{selectedTask.title}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{item.at}</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[rgba(245,245,242,0.76)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[rgba(255,255,255,0.12)] p-6 text-sm text-[var(--muted)]">
            当前没有匹配的事项。
          </div>
        )}
      </aside>
    </div>
  );
}
