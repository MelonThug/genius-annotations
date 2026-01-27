import React from "react"
import styles from '../../css/app.module.scss'
import { config } from "../../configDefaults"

export default function ProxySection({proxyUrl, setProxyUrl}: {proxyUrl: string, setProxyUrl: React.Dispatch<React.SetStateAction<string>>}){
    return (
        <div className={`${styles.config_container} ${styles.row}`}>
            <div className={styles.config_container}>
                <p className={styles.config_text_label}>Proxy URL</p>
                <sub>The proxy URL used to bypass CORS. Default: 
                    <br></br>
                    <code>{config.PROXY}</code>
                </sub>
                <input 
                type="text" 
                className={styles.config_input_text}
                id="config-proxy-url" 
                value={proxyUrl}
                onChange={(e) => {setProxyUrl(e.target.value)}}
                />
            </div>
        </div>
    )
}