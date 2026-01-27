import React from "react";
import styles from '../../css/app.module.scss'

export default function SaveSection({proxyUrl}: {proxyUrl: string}){
    return (
        <button 
        className={styles.config_button} 
        style={{backgroundColor: "hsl(142deg 76% 48%)"}} 
        onClick={() => {
            Spicetify.LocalStorage.set("genius-annotations-proxy", proxyUrl);
            Spicetify.showNotification("Config saved!");
            Spicetify.PopupModal.hide()
        }}>
        Save Config
        </button>
    )
}