// components/Loader.js
import style from '../../styles/Loader.module.css'

const Loader = ({ tip }) => {
    return (
        <div className={style.spinnerParent}>
            <div className={style.outer}>
                <div className={style.spinner}>
                    <div className={style.rect1}></div>
                    <div className={style.rect2}></div>
                    <div className={style.rect3}></div>
                    <div className={style.rect4}></div>
                    <div className={style.rect5}></div>
                </div>

                {/* <div className={style.tip}>
                    Tip: {tip} 

                </div> */}
            </div>
        </div>
    );
};

export default Loader;
