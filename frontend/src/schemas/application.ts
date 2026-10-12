import type { PaymentMethod } from '@/types/application'
import * as yup from 'yup'

// 申込者情報のバリデーションスキーマ
export const applicantSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('名前は必須です。')
    .max(50, '名前は50文字以内で入力してください。'),
  phone: yup
    .string()
    .required('電話番号は必須です。')
    .matches(/^\d{10,11}$/, '電話番号は10桁または11桁の数字で入力してください。'),
})

// 支払方法のバリデーションスキーマ
// 必須になるのは「申込者情報が確認済み（＝支払方法のモジュールが表示されている）」ときだけ。
// 確認済みの数はフォームの値ではないので、$ 付きの名前で「外から渡される context」を参照する
export const paymentSchema = yup.object({
  method: yup
    .mixed<PaymentMethod>()
    .oneOf(['credit', 'bank'], '支払方法を選択してください。')
    .nullable()
    .when('$confirmedCount', {
      is: (confirmedCount: number) => confirmedCount >= 1,
      then: (schema) => schema.required('支払方法を選択してください。'),
      // 省略すると「元のスキーマのまま」になる。ここでは「必須ではない」ことを明示する
      otherwise: (schema) => schema.notRequired(),
    }),
})

// フォーム全体のバリデーションスキーマ
export const applicationFormSchema = yup.object({
  applicant: applicantSchema,
  payment: paymentSchema,
})

// フォームの値の型を推論
export type ApplicationFormValues = yup.InferType<typeof applicationFormSchema>
