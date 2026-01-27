import React, { useState } from "react";
import styles from '../../css/app.module.scss'
import { config } from "../../configDefaults";
import { VersionInfo } from "../../types/versionInfo";
import { marked } from "marked";

export default function UpdateSection({versionInfoParam, checkForUpdates}: {versionInfoParam: VersionInfo, checkForUpdates: () => Promise<VersionInfo>}){
    const [checkedForUpdates, setCheckedForUpdates] = useState(false);
    const [versionInfo, setVersionInfo] = useState(versionInfoParam);
    const [copiedCommand, setCopiedCommand] = useState(false);

    return (
        <>
            <div className={styles.config_container}>
                <p className={styles.config_text_label}>Check for updates</p>

                <div className={styles.config_text_container}>
                    <sub>Current Version: {config.VERSION}</sub>
                    {versionInfo.isOutdated ?
                        <>
                        <sub><b>Update available! ({versionInfo.latestVersion})</b></sub>
                        <sub>Powershell install command:</sub>
                        <code>{config.INSTALL_COMMAND}</code>
                        </> 
                    : checkedForUpdates && <sub>No new updates found</sub>
                    }
                </div>

                <div className={`${styles.config_container} ${styles.row}`}>
                    <button 
                    className={styles.config_button}
                    onClick={async () => {
                        setVersionInfo(await checkForUpdates());
                        setCheckedForUpdates(true);
                    }}>
                    Check for updates
                    </button>

                    {versionInfo.isOutdated ? 
                    <button
                    className={styles.config_button}
                    onClick={() => {
                        Spicetify.Platform.ClipboardAPI.copy(config.INSTALL_COMMAND)
                        setCopiedCommand(true);
                        setTimeout(() => setCopiedCommand(false), 2000)
                    }}>
                    Copy Install Command
                    </button>
                    : ""
                    }
                </div>

                {copiedCommand && <sub>Copied install command to clipboard!</sub>}
                {versionInfo.isOutdated ? 
                <>
                    <div>
                        <p>Changelog</p>
                        <sub className={styles.changelog} dangerouslySetInnerHTML={{__html: marked(versionInfo.changelog)}}></sub>
                    </div>
                </>
                : ""}
            </div> 
        </>
    )
    
}