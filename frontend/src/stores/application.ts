import type { ApplicantInfo, ApplicationModule } from '@/types/application'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

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
  const applicant = ref<ApplicantInfo>({
    name: '',
    phone: '',
  })

  // getter
  // 今入力中のモジュール
  const currentModule = computed(() => modules.value[confirmedCount.value])

  // action
  return {
    modules,
    currentModule,
    confirmedCount,
    applicant,
  }
})
