import type { V4ComposerConfigPicker } from "./configPickerState.js";

/**
 * App 层（斜杠命令、外部入口）请求 composer 执行的一次 UI 动作。
 *
 * 扩展方式：新增动作时在本 union 追加成员，并在 V4ComposerModelControls 的
 * 消费 effect 增加对应分支；上层（SessionPane）只 dispatch 动作，不感知实现。
 * 不要为新动作另开第二条请求 prop，保持单一请求通道。
 * 宿主自有动作（打开侧聊/插件面板等）不经此通道——直接用 AppSlashCommand.run()
 * 在 SessionPane 内执行即可，本通道只服务 composer 内部（子组件持有的）UI 状态。
 */
export type V4ComposerUiAction = {
  type: "openConfigPicker";
  picker: V4ComposerConfigPicker;
};

/**
 * 一次性请求信号：requestId 递增保证同一动作可连续触发两次，重放不重复执行
 * （复用 externalTextInsertRequest 的请求模式）。
 */
export interface V4ComposerUiRequest {
  requestId: number;
  action: V4ComposerUiAction;
}
