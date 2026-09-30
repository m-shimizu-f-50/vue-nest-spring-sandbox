<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'

// ① yup でルールを書く（キーの email が項目の名前になる）
const validationSchema = toTypedSchema(
  yup.object({
    email: yup
      .string()
      .required('メールアドレスは必須です')
      .email('メールアドレスの形式が正しくありません'),
  }),
)

// ② useForm にルールを渡す（フォーム全体の管理者）
const { handleSubmit, errors } = useForm({ validationSchema })

// ③ useField で入力欄とつなぐ（名前はスキーマのキーと一致させる）
const { value: email, errorMessage: emailError } = useField<string>('email')

// ⑤ 送信：全項目のチェックに通ったときだけ、渡した関数が呼ばれる
const submittedEmail = ref('')
const onSubmit = handleSubmit((values) => {
  submittedEmail.value = values.email // values は { email: string } 型
})
</script>

<template>
  <main class="practice">
    <h1>VeeValidate の基本</h1>
    <p class="note">
      yup でルールを書き、<code>useForm</code> に渡し、<code>useField</code>
      で入力欄とつなぐ。チェックのタイミングは「開いた直後はしない」「値が変わるたびにする」「送信時は全項目する」。
    </p>

    <section>
      <h2>メールアドレス1項目の最小フォーム</h2>

      <!-- ④ フォーム全体のエラー：useForm の errors -->
      <div class="form-errors">
        <p class="caption">useForm の <code>errors</code>（フォーム全体のまとめ）</p>
        <p class="error">{{ errors.email ?? '（エラーなし）' }}</p>
      </div>

      <form @submit="onSubmit" class="form">
        <label class="field">
          メールアドレス
          <!-- type="email" だとブラウザのチェックが割り込むので text にしている -->
          <input type="text" v-model="email" />
        </label>

        <!-- ④ 項目ごとのエラー：useField の errorMessage -->
        <p class="caption">useField の <code>errorMessage</code>（項目の近く）</p>
        <p class="error">{{ emailError ?? '（エラーなし）' }}</p>

        <button type="submit">送信</button>
      </form>

      <p v-if="submittedEmail" class="success">送信しました：{{ submittedEmail }}</p>
    </section>
  </main>
</template>

<style scoped>
.practice {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.note {
  font-size: 0.9rem;
  opacity: 0.8;
}

section {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.form-errors {
  padding: 0.5rem 0.75rem;
  margin: 0.5rem 0 1rem;
  border-left: 4px solid hsl(0, 70%, 55%);
  background-color: hsla(0, 70%, 55%, 0.08);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field input {
  width: 20rem;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
}

.caption {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

.error {
  color: hsl(0, 70%, 55%);
}

.form button {
  margin-top: 0.75rem;
}

.success {
  margin-top: 1rem;
  color: hsla(160, 100%, 37%, 1);
  font-weight: 600;
}
</style>
