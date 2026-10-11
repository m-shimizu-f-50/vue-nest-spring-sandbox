// 画面に積まれていくモジュールの識別子
export type ModuleId = 'applicant' | 'payment' | 'plan' | 'complete'

// モジュール一覧の1件分（ステータスバーの1行にもなる）
export interface ApplicationModule {
  id: ModuleId
  label: string
}

// モジュール1：申込者情報
export interface ApplicantInfo {
  name: string
  phone: string
}
