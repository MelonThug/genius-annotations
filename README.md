# Genius Annotations & Lyrics
Displays the current song's lyrics, annotations and description sourced from [Genius](https://genius.com)  
Includes a list of available translations, as well as the link to the song page on Genius at the bottom of the lyrics.  
Requires [Spicetify](https://spicetify.app/) installed to use.

## Main features:
- Song lyrics
- Song descriptions
- Annotations on lyrics
- Lyric translations
- 1 command install
- Automatic update checking with subtle notification (includes copyable install command)
- Caching on both the client and default supplied proxy for faster song lookups and reduced network requests.
*Features subject to availability on Genius*  

## Installation

### Automatic (Windows, Powershell)
1. Open Powershell
2. Run:
```
iwr -useb "https://raw.githubusercontent.com/MelonThug/genius-annotations/refs/heads/main/install.ps1" | iex
```

### Manual
1. Download the latest release
2. Extract to your CustomApps folder (Windows default: ```%appdata%\spicetify\CustomApps```) 
3. Run:
```
spicetify config custom_apps genius-annotations
spicetify apply
```
Done.  

### Usage
Use the app by clicking its icon on the top left of Spotify (circled red in this image)  
<img src="resources/iconLocation.png"/>  

Available translations can be selected from the dropdown at the top of the lyrics page.
Lyrics with annotations will be highlighted green. Click them to see the annotation.  

## Previews
<img src="resources/previewGif.gif" width="500" height="500"/>  

<img src="resources/translationPreview.png" width="500" height="500" />  

<img src="resources/annotationPreview.png" width="500" height="500" />  

## Updating
Copy and run the powershell command from the app's config panel.  
The app will automatically check for updates on launch.  
<img src="resources/configLocation.png" width="500"/>  
<img src="resources/configPreview.png" width="500" height="500">