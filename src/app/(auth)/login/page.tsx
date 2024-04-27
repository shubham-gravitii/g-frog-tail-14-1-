import LoginArea_N from '../../../components/Login/LoginArea_N';
import { Amplify } from 'aws-amplify';
import config from '../../../amplifyconfiguration.json'
const Login = () => {
    Amplify.configure(config)
    return (
        <>
            <LoginArea_N />
        </>
    );
};

export default Login;