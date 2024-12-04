import React, {useState} from 'react';
import {Form, Input, message, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import Button from "antd/es/button";
import { OTPProps } from 'antd/es/input/OTP';
import {collection, getDocs, query, where } from 'firebase/firestore';
import {db} from "../../firebase";
import {useAppDispatch} from "../../hooks/storeHooks";
import {userEnter} from "../../store/reducers/user";
import {IUser} from "../../types/User";
import {useNavigate} from "react-router-dom";
import {HOME_ROUTE} from "../../utils/const";

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [form] = useForm();

    const [isLogin, setIsLogin] = useState<boolean>(false);

    const onFormFinish = async (values: any) => {
        try {
            setIsLogin(true);
            const q = query(collection(db, "accounts"), where("username", "==", values.username));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                if (doc.data().password === values.password) {
                    dispatch(userEnter(doc.data() as IUser))
                } else {
                    message.error("Не правильный пароль")
                }
            });

            setTimeout(() => {
                setIsLogin(false);
                navigate(HOME_ROUTE);
            }, 250)
        } catch (err) {
            err && message.error(err.toString());
            setIsLogin(false);
        }
    };

    const onFormFinishFailed = (errorInfo: any) => {
        // todo handle form finish fail
    };

    const onFormClearClick = () => {
        form.resetFields();
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: window.innerHeight - 90
        }}>
            <Row style={{backgroundColor: "#fafafa", padding: 24, borderRadius: 8}} gutter={[16, 16]}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    layout="horizontal"
                    initialValues={{remember: true}}
                    onFinish={onFormFinish}
                    onFinishFailed={onFormFinishFailed}
                >
                    <Form.Item label="Username" name="username">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input.OTP mask="🔒" length={4}/>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button loading={isLogin} type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
        </div>
    );
};

export default SignIn;