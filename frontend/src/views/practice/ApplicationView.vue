<script setup lang="ts">
import ApplicantModule from '@/components/application/ApplicantModule.vue'
import ModuleFooter from '@/components/application/ModuleFooter.vue'
import PaymentModule from '@/components/application/PaymentModule.vue'
import StatusBar from '@/components/application/StatusBar.vue'
import { useApplicationStore } from '@/stores/application'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { applicationFormSchema } from '@/schemas/application'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const applicationStore = useApplicationStore()
const { isModuleVisible, proceed, cancelApplication } = applicationStore
const { applicant, payment, confirmedCount } = storeToRefs(applicationStore)

// 確認済みの数をスキーマの context（$confirmedCount）として渡す。
// 数が変わるたびにスキーマを作り直すため computed にする
// （opts を渡すと既定の abortEarly: false が消えるので、明示して全エラーを集める）
const validationSchema = computed(() =>
  toTypedSchema(applicationFormSchema, {
    abortEarly: false,
    context: { confirmedCount: confirmedCount.value },
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema,
  initialValues: {
    applicant: { ...applicant.value },
    payment: { ...payment.value },
  },
})

const onProceed = handleSubmit((values) => {
  // バリデーションが成功した場合、store に値を保存する
  applicationStore.saveApplicant(values.applicant)
  applicationStore.savePayment({ method: values.payment.method ?? null })
  proceed()
})

const onCancel = () => {
  cancelApplication()
  resetForm({
    values: {
      applicant: { ...applicant.value },
      payment: { ...payment.value },
    },
  })
}
</script>

<template>
  <div class="application-shell">
    <aside class="status-area">
      <StatusBar />
    </aside>

    <main class="module-area">
      <ApplicantModule />
      <PaymentModule v-if="isModuleVisible('payment')" />
    </main>

    <div class="footer-area">
      <ModuleFooter @proceed="onProceed" @cancel="onCancel" />
    </div>
  </div>
</template>

<style scoped>
.application-shell {
  display: grid;
  grid-template-columns: 180px 1fr; /* 左：ステータスバー／右：モジュール */
  gap: 1.5rem;
  padding: 1.5rem 0;
}

.status-area {
  position: sticky; /* モジュールが縦に伸びても、ステータスバーは見えたまま */
  top: 4rem;
  align-self: start;
}

.footer-area {
  grid-column: 1 / -1; /* ステータスバーとモジュールの2列をまたいで横幅いっぱいにする */
}

.module-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
