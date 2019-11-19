import React from 'react'
import { Form, Icon, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { connect } from 'dva'
import { ConnectState, ConnectProps } from '@/models/connect'
import LoginLogoImg from '@/assets/images/login_logo.png'
import styles from './styles/index.less'

const FormItem = Form.Item

interface IProp extends ConnectProps, FormComponentProps {
  submitting: boolean
}

interface IState {
  verificationCode: string
}

class Login extends React.Component<IProp, IState> {
  state: IState = {
    verificationCode: `/api/verify_code?_rnd=${+new Date()}`
  }

  nameInputRef = React.createRef<Input>()

  componentDidMount() {
    this.nameInputRef.current!.focus()
  }

  refreshVerificationCode = () => {
    this.setState({
      verificationCode: `/api/verify_code?_rnd=${+new Date()}`
    })
  }

  handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const { form, dispatch } = this.props

    form.validateFields((err, values) => {
      if (err) return
      dispatch!({
        type: 'login/login',
        payload: values,
        callback: this.refreshVerificationCode
      })
    })
  }

  render() {
    const { form, submitting } = this.props
    const { getFieldDecorator } = form
    const { verificationCode } = this.state

    return (
      <div className={styles.main}>
        <div className={styles.form_wrapper}>
          <Form className={styles.form} onSubmit={this.handleSubmit}>
            <div className={styles.logo}>
              <img src={LoginLogoImg} alt="logo" />
            </div>
            <FormItem>
              {getFieldDecorator('user_name', {
                rules: [{ required: true, message: '请输入用户名' }]
              })(
                <Input ref={this.nameInputRef} prefix={<Icon type="user" />} placeholder="用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }]
              })(<Input prefix={<Icon type="lock" />} type="password" placeholder="密码" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('verification_code', {
                validateTrigger: 'onBlur',
                rules: [{ required: true, len: 4, message: '请输入4位长度的验证码' }]
              })(
                <div className={styles.code_wrapper}>
                  <Input className={styles.code_input} placeholder="验证码" />
                  <div className={styles.code}>
                    <img
                      src={verificationCode}
                      alt="验证码"
                      title="点击重新获取"
                      onClick={this.refreshVerificationCode}
                    />
                  </div>
                </div>
              )}
            </FormItem>
            <FormItem>
              <Button
                className={styles.submit}
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(
  connect(({ loading }: ConnectState) => ({
    submitting: loading.effects['login/login']!
  }))(Login)
)
