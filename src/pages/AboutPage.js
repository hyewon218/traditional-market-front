import BasicLayout from "../layouts/BasicLayout";
import useCustomLogin from "../hooks/useCustomLogin";

const AboutPage = () => {

    const {isLogin, moveToLoginReturn} = useCustomLogin() // 로그인이 필요한 페이지

    if(!isLogin){
        return moveToLoginReturn()
    }

    return (
        <BasicLayout>
            <div className="text-3xl font-bold">
                <div>About Page</div>
            </div>
        </BasicLayout>
    );
}
export default AboutPage;