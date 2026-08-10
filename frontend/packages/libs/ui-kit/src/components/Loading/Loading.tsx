import { type FC, type ReactNode } from 'react'
import Overlay from '../Overlay/Overlay'
import styles from './Loading.module.scss'
import { BiLoader } from 'react-icons/bi'
import Backdrop from '../Backdrop/Backdrop'

interface LoadingProps {
    loadingContent?: ReactNode;
    loadingText?: string | ReactNode;
}

const Loading: FC<LoadingProps> = ({ loadingContent, loadingText }) => {
    return (
        <Overlay>
            <Backdrop>
                <div className={styles.loading_wrapper}>
                    {loadingContent ||
                        <div className={styles.loading_content}>
                            <BiLoader size={80} className={styles.loading_icon} />
                            {
                                <p>{loadingText}</p>
                            }
                        </div>
                    }
                </div>
            </Backdrop>
        </Overlay>
    )
}

export default Loading