import type { ApplicantInfo, ApplicationModule, ModuleId, PaymentInfo } from '@/types/application'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 空の申込者情報を毎回新しく作って返す
function createInitialApplicant(): ApplicantInfo {
  return {
    name: '',
    phone: '',
  }
}
// 空の支払方法を毎回新しく作って返す
function createInitialPayment(): PaymentInfo {
  return {
    method: null,
  }
}

export const useApplicationStore = defineStore('application', () => {
  // state
  // モジュールの一覧
  const modules = ref<ApplicationModule[]>([
    { id: 'applicant', label: '申込者情報' },
    { id: 'payment', label: 'お支払い情報' },
    { id: 'plan', label: 'プラン選択' },
    { id: 'complete', label: '完了' },
  ])

  // 現在のモジュールのインデックス
  const confirmedCount = ref(0)

  // 申込者情報
  const applicant = ref<ApplicantInfo>(createInitialApplicant())

  // 支払方法
  const payment = ref<PaymentInfo>(createInitialPayment())

  // getter
  // 今入力中のモジュール
  const currentModule = computed(() => modules.value[confirmedCount.value])

  // そのモジュールを表示してよいか（確認済みのモジュールと、今入力中のモジュールが表示対象）
  // 例：confirmedCount が 1 のとき、index 0 と 1 のモジュールが表示対象
  function isModuleVisible(id: ModuleId): boolean {
    const index = modules.value.findIndex((m) => m.id === id)

    return index > -1 && index <= confirmedCount.value // index が見つかり、かつ confirmedCount 以下であれば表示対象
  }

  // action
  // 今入力中のモジュールで押されたときだけ confirmedCount を進める
  function proceed(id: ModuleId): void {
    const index = modules.value.findIndex((m) => m.id === id)

    if (index === confirmedCount.value) {
      confirmedCount.value++
    }
  }
  // 入力値と進捗をすべて最初に戻す
  function cancelApplication(): void {
    confirmedCount.value = 0
    applicant.value = createInitialApplicant()
    payment.value = createInitialPayment()
  }

  return {
    modules,
    currentModule,
    confirmedCount,
    applicant,
    payment,
    isModuleVisible,
    proceed,
    cancelApplication,
  }
})
