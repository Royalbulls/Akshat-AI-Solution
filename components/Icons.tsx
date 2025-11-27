
import React from 'react';

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25.375.375 0 01-.75 0 6 6 0 0112 0 .375.375 0 01-.75 0A5.25 5.25 0 0012 1.5zM12 22.5a5.25 5.25 0 005.25-5.25.375.375 0 01.75 0 6 6 0 01-12 0 .375.375 0 01.75 0A5.25 5.25 0 0012 22.5zM1.5 12a5.25 5.25 0 005.25 5.25.375.375 0 010 .75 6 6 0 010-12 .375.375 0 010 .75A5.25 5.25 0 001.5 12zM22.5 12a5.25 5.25 0 00-5.25-5.25.375.375 0 010-.75 6 6 0 010 12 .375.375 0 010-.75A5.25 5.25 0 0022.5 12z" clipRule="evenodd" />
  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM12 5.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75z" />
        <path d="M12 15a3 3 0 003-3V9a3 3 0 00-6 0v3a3 3 0 003 3z" />
    </svg>
);

export const PaperClipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.5 10.5a.75.75 0 001.06 1.06l10.5-10.5a.75.75 0 011.06 0 2.25 2.25 0 003.182-3.182l-1.5-1.5a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 010 1.06l-6 6a.75.75 0 001.06 1.06l6-6a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
    <path d="M8.625 12.375a3.75 3.75 0 115.304 5.304l-1.5 1.5a.75.75 0 01-1.06-1.06l1.5-1.5a2.25 2.25 0 00-3.182-3.182l-5.25 5.25a.75.75 0 01-1.06-1.06l5.25-5.25z" />
  </svg>
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25-2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06l2.76-2.76a.75.75 0 011.06 0l3.75 3.75a.75.75 0 001.06 0l2.5-2.5a.75.75 0 011.06 0l2.75 2.75v.24a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.24zM8.25 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
  </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.184c0-1.681.673-3.352 1.88-4.566z" clipRule="evenodd" />
        <path d="M6.75 12a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zM3 15a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zM3 9a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 013 9z" />
    </svg>
);

export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.644 2.37a.75.75 0 01.712 0l8.25 4.125a.75.75 0 010 1.332l-8.25 4.125a.75.75 0 01-.712 0l-8.25-4.125a.75.75 0 010-1.332l8.25-4.125zM12 4.453l-6.82 3.41 6.82 3.41 6.82-3.41L12 4.453zm-8.25 6.332a.75.75 0 01.712 0l8.25 4.125a.75.75 0 010 1.332l-8.25 4.125a.75.75 0 01-.712 0l-8.25-4.125a.75.75 0 010-1.332l8.25-4.125zM3.75 12.453l-6.82 3.41 6.82 3.41 6.82-3.41L3.75 12.453z" clipRule="evenodd" />
    </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.946 1.542A12.034 12.034 0 006.35 6.35a12.035 12.035 0 00-2.553 2.553c-.88.247-1.542.92-1.542 1.838v.216c0 .917.663 1.699 1.542 1.946.431.12.87.252 1.314.395a12.035 12.035 0 002.553 2.553c.247.88.92 1.542 1.838 1.542h.216c.917 0 1.699-.663 1.946-1.542a12.035 12.035 0 002.553-2.553 12.035 12.035 0 002.553-2.553c.88-.247 1.542-.92 1.542-1.838v-.216c0 .917-.663-1.699-1.542-1.946a12.035 12.035 0 00-2.553-2.553 12.035 12.035 0 00-2.553-2.553c-.247-.88-.92-1.542-1.838-1.542h-.216zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
    </svg>
);

export const AppsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
);

export const ThumbsUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
  </svg>
);

export const ThumbsDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.477 13.5c.806 0 1.533.446 2.031 1.08a9.041 9.041 0 0 1 2.861 2.4c.723.384 1.35.956 1.653 1.715a4.498 4.498 0 0 0 .322 1.672V21.25a.75.75 0 0 1-.75.75 2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218-.266-.558.107-1.282.725-1.282h3.126c1.026 0 1.945-.694 2.054-1.715.045-.422.068.85.068-1.285a11.95 11.95 0 0 0-2.649-7.521c-.388-.482-.987-.729-1.605-.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-4.25H14.25M5.904 5.5c.083-.205.173-.405.27-.602.197-.4-.078-.898-.523-.898h-.908c-.889 0-1.713-.518-1.972 1.368a12 12 0 0 0-.521 3.507c0 1.553.295 3.036.831 4.398C3.387 14.047 4.167 14.5 5 14.5h1.053c.472 0 .745-.556.5-.96a8.958 8.958 0 0 1-1.302-4.665c0-1.194.232 2.333.654-3.375Z" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.5 4.478v-1.978a2.25 2.25 0 00-2.25-2.25h-4.5a2.25 2.25 0 00-2.25 2.25v1.978A23.953 23.953 0 0112 21c2.31 0 4.54-.326 6.64-1.002A18.006 18.006 0 0012 3c-4.418 0-8.447 1.49-11.64 4.002A23.953 23.953 0 017.5 4.478v-1.978a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v1.978c.84.113 1.666.262 2.473.44v-.94a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.94c.807-.178 1.633-.327 2.473-.44a.75.75 0 01.75.75h.008a.75.75 0 01.75-.75v-.94zM5.25 7.5A2.25 2.25 0 003 9.75v7.5A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25v-7.5A2.25 2.25 0 0018.75 7.5H5.25z" clipRule="evenodd" />
    </svg>
);

export const VideoCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-2.252a3.001 3.001 0 00.984-1.932A3 3 0 0015 9V7.5a3 3 0 00-3-3H4.5z" />
        <path d="M18 6a3 3 0 00-3 3v.161l4.137-2.482a.75.75 0 011.213.65v11.342a.75.75 0 01-1.213.65L15 14.839V15a3 3 0 003 3h.75a3 3 0 003-3v-9a3 3 0 00-3-3h-.75z" />
    </svg>
);

export const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 9.375a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5z" clipRule="evenodd" />
    </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.447.146 2.596 1.459A1.5 1.5 0 0113.5 14.25h-1.5a.75.75 0 000 1.5h1.5a3 3 0 10-3-3V9.75a.75.75 0 011.5 0v.728c.569-.379 1.28-.54 1.983-.396 1.05.213 1.83.987 2.016 2.016.208 1.15-.4 2.263-1.43 2.825a.75.75 0 01-.986-.425 1.5 1.5 0 00-1.423-.986H12a.75.75 0 010-1.5h.5a.75.75 0 00.75-.75.75.75 0 00-.75-.75h-.5a.75.75 0 00-.75.75v.054c-.537.161-1.02.493-1.386.993a.75.75 0 01-1.06-1.06c.45-.516 1.057-.9 1.734-1.11zM11.25 16.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
    </svg>
);
  
export const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export const FileTxtIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a.375.375 0 01-.375-.375V6.75A3.75 3.75 0 009 3H5.625zM12.75 12.75a.75.75 0 000-1.5h-3a.75.75 0 000 1.5h3z" clipRule="evenodd" />
    </svg>
);

export const FileDocIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.25 4.533A9.708 9.708 0 001.5 12c0 5.385 4.365 9.75 9.75 9.75s9.75-4.365 9.75-9.75c0-4.01-2.422-7.44-5.83-8.841a.75.75 0 00-.42-1.33c-1.32-.243-2.686-.36-4.082-.36-1.396 0-2.762.117-4.082.36a.75.75 0 00-.42 1.33z" />
      <path fillRule="evenodd" d="M12.75 18a.75.75 0 000-1.5H14.25a.75.75 0 000-1.5H12a.75.75 0 01-.75-.75V6.75a.75.75 0 00-1.5 0v3.455a3 3 0 01-3 2.949V15a.75.75 0 001.5 0v-1.002a1.5 1.5 0 003 0V15a3 3 0 003 3h.75z" clipRule="evenodd" />
    </svg>
);

export const FileCsvIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.75 3.75h-1.5V2.25a.75.75 0 00-1.5 0V3.75h-1.5A.75.75 0 0013.5 4.5v1.5a.75.75 0 00.75.75h1.5v1.5a.75.75 0 001.5 0V6.75h1.5a.75.75 0 00.75-.75V4.5a.75.75 0 00-.75-.75z" />
      <path fillRule="evenodd" d="M3 3.75A2.25 2.25 0 015.25 1.5h6.375c.623 0 1.223.253 1.652.682l3.447 3.447c.429.429.682 1.029.682 1.652V8.25a.75.75 0 01-1.5 0V7.5a.75.75 0 00-.22-.53l-3.448-3.448A.75.75 0 0011.625 3H5.25a.75.75 0 00-.75.75v16.5c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-6.75a.75.75 0 011.5 0v6.75A2.25 2.25 0 0118.75 22.5H5.25A2.25 2.25 0 013 20.25V3.75z" clipRule="evenodd" />
      <path d="M7.875 12.75a.75.75 0 000 1.5h.375a.75.75 0 000-1.5h-.375zM8.25 10.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zM12 12.75a.75.75 0 000 1.5h.375a.75.75 0 000-1.5H12zM11.25 15a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12 10.5a.75.75 0 01.75.75v.001a.75.75 0 01-1.5 0V11.25a.75.75 0 01.75-.75z" />
    </svg>
);

export const JournalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 .5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533.75.75 0 0 0 0-1.332A8.217 8.217 0 0 1 6 18a8.235 8.235 0 0 1-2.25-.333V5.167c.964.225 1.956.333 3 .333a8.217 8.217 0 0 0 5.25-1.967.75.75 0 0 0 0-1.332Z" />
      <path d="M12.75 4.533A9.707 9.707 0 0 0 18 3a9.735 9.735 0 0 0 3.25.555.75.75 0 0 1 .5.707v14.25a.75.75 0 0 1-.5.707A9.735 9.735 0 0 1 18 21a9.707 9.707 0 0 1-5.25-1.533.75.75 0 0 1 0-1.332A8.217 8.217 0 0 0 18 18a8.235 8.235 0 0 0 2.25-.333V5.167c-.964.225-1.956.333-3 .333a8.217 8.217 0 0 1-5.25-1.967.75.75 0 0 1 0-1.332Z" />
    </svg>
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.182 15.182 0 01-1.06-1.06c-.31-.318-.6-.645-.85-1.002a7.72 7.72 0 01-1.464-3.042 5.25 5.25 0 01-.03-2.637 5.25 5.25 0 01.322-1.962L12 2.812l8.038 8.038a5.25 5.25 0 01.322 1.962 5.25 5.25 0 01-.03 2.637 7.72 7.72 0 01-1.464 3.042 15.182 15.182 0 01-1.06 1.06 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001a.75.75 0 01-.708 0h-.001a.75.75 0 01-.708 0h-.001z" />
    </svg>
);

export const AgentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 111.06-1.06l1.591 1.591a.75.75 0 11-1.06 1.06l-1.591-1.591zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.803 17.803a.75.75 0 111.06 1.06l-1.59 1.591a.75.75 0 11-1.06-1.06l1.59-1.591zM12 21.75a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0v2.25a.75.75 0 01-.75.75zM6.106 18.894a.75.75 0 11-1.06 1.06l-1.591-1.591a.75.75 0 111.06-1.06l1.591 1.591zM3 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM6.197 5.045a.75.75 0 11-1.06-1.06l1.59-1.591a.75.75 0 111.06 1.06l-1.59 1.591z" />
    </svg>
);

export const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M7.5 5.25A2.25 2.25 0 019.75 3h4.5A2.25 2.25 0 0116.5 5.25V6h3.75A2.25 2.25 0 0122.5 8.25v8.5A2.25 2.25 0 0120.25 19.5H3.75A2.25 2.25 0 011.5 16.75v-8.5A2.25 2.25 0 013.75 6H7.5V5.25zm-1.5 3.75a.75.75 0 000 1.5h13.5a.75.75 0 000-1.5H6z" clipRule="evenodd" />
    </svg>
);

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.25a.75.75 0 01.75.75v2.519c.143.064.288.128.432.19.145.063.29.125.433.186a10.48 10.48 0 013.676 1.517.75.75 0 01-.645 1.348 9.01 9.01 0 00-3.12-1.296.75.75 0 01-.365-.658V3a.75.75 0 01-.75-.75z" />
      <path fillRule="evenodd" d="M12 22.5c-4.142 0-7.5-3.358-7.5-7.5 0-2.835 1.583-5.263 3.868-6.56C10.057 7.618 11.03 7.5 12 7.5c.97 0 1.944.118 2.87.348 1.432.365 2.65 1.186 3.493 2.25.39.513.737 1.063.999 1.657.262.593.438 1.238.438 1.912 0 4.142-3.358 7.5-7.5 7.5zm.36-15a.75.75 0 011.06-1.06 8.956 8.956 0 013.12 1.296.75.75 0 01-.645 1.348 7.456 7.456 0 00-2.583-1.032.75.75 0 01-.952.448zM8.318 9.09a.75.75 0 01-.952-.448 7.456 7.456 0 00-2.583 1.032.75.75 0 11-.645-1.348 8.956 8.956 0 013.12-1.296.75.75 0 011.06 1.06z" clipRule="evenodd" />
    </svg>
);
  
export const BeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M3.75 3A.75.75 0 003 3.75v.512c.58.066 1.17.143 1.77.234a.75.75 0 00.75-.71V3.75A.75.75 0 004.77 3H3.75zM8.25 3A.75.75 0 007.5 3.75v.425a.75.75 0 00.658.743 4.5 4.5 0 013.684 0 .75.75 0 00.658-.743V3.75A.75.75 0 0012 3H8.25zM4.5 6.037A41.206 41.206 0 009.25 7.5h5.5a41.205 41.205 0 004.75-1.463.75.75 0 01.75 1.464A42.71 42.71 0 0114.75 9h-5.5a42.71 42.71 0 01-4.75-1.5.75.75 0 010-1.463zM19.5 3.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.512c-.58.066-1.17.143-1.77.234a.75.75 0 01-.75-.71V3.75z" clipRule="evenodd" />
      <path d="M6 10.5h12v7.5a3 3 0 01-3 3H9a3 3 0 01-3-3v-7.5z" />
    </svg>
);
  
export const NewspaperIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8.25 3.75A2.25 2.25 0 006 6v12a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 18V6a2.25 2.25 0 00-2.25-2.25h-7.5zM9 6a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 019 6zm2.25.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM9 10.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 019 10.5zm2.25.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM9 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 019 15zm2.25.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM9 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 019 15zm2.25.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
    </svg>
);
  
export const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.5 21a1.503 1.503 0 001.5 1.5h0a1.5 1.5 0 001.5-1.5v-1.125a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21a1.5 1.5 0 001.5 1.5h0a1.5 1.5 0 001.5-1.5V10.875a3 3 0 00-3-3H16.5V6a3 3 0 00-3-3h-3a3 3 0 00-3 3v1.875H3.75a3 3 0 00-3 3V21a1.5 1.5 0 001.5 1.5h0a1.5 1.5 0 001.5-1.5v-1.125a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21zM9 6a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 6v1.875a3 3 0 00-3 3h-1.5a3 3 0 00-3-3V6z" clipRule="evenodd" />
    </svg>
);

export const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.342-4.995.75.75 0 01.323 1.223l-3.32 5.21a5.25 5.25 0 01-7.346 1.9L2.166 16.03a.75.75 0 01-1.018-1.078l3.4-3.555a5.25 5.25 0 017.452-1.644z" clipRule="evenodd" />
      <path d="M1.373 19.33l3.25-3.251a5.232 5.232 0 001.928.465l-2.074 2.073a.75.75 0 001.06 1.06l2.074-2.073a5.25 5.25 0 003.38.835l-3.48 3.48a.75.75 0 01-1.06 0l-3.04-3.04a.75.75 0 010-1.06l1.325-1.326a5.25 5.25 0 00-.465-1.928L1.373 19.33zM21.828 8.64a.75.75 0 01.145 1.054l-4.252 5.516a.75.75 0 01-1.139-.247l-3.081-5.135a5.25 5.25 0 002.046-1.588l5.22-4.212a.75.75 0 011.06.06z" />
    </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);

export const DnaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M6.72 5.66a.75.75 0 01.22-.53L9.69 2.38a.75.75 0 011.06 0l2.75 2.75a.75.75 0 01-.53 1.28H12a.75.75 0 00-.75.75v3.25a.75.75 0 001.5 0V9.75a.75.75 0 01.75-.75h.31l-1.97-1.97a.75.75 0 00-1.06 0L8.03 9.78a.75.75 0 01-1.06-1.06l-1.5-1.5a.75.75 0 01.22-1.28v.01zM11.25 12.75a.75.75 0 00-1.5 0v.25a.75.75 0 01-.75.75H8.72a.75.75 0 01-.53-.22L5.44 10.78a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.28-.22V12a.75.75 0 00-.75-.75H3.75a.75.75 0 000 1.5h2.31l1.97 1.97a.75.75 0 001.06 0l2.22-2.22a.75.75 0 011.06 0l2.22 2.22a.75.75 0 001.06 0l1.97-1.97h2.31a.75.75 0 000-1.5h-2.58a.75.75 0 00-.75.75v1.06a.75.75 0 00.22 1.28l1.5 1.5a.75.75 0 001.06-1.06l-2.75-2.75a.75.75 0 00-1.06 0l-1.5 1.5a.75.75 0 01-1.06 0l-2.22-2.22a.75.75 0 00-1.06 0zM17.28 18.34a.75.75 0 01-.22.53l-2.75 2.75a.75.75 0 01-1.06 0l-2.75-2.75a.75.75 0 01.53-1.28H12a.75.75 0 00.75-.75v-3.25a.75.75 0 00-1.5 0v.97a.75.75 0 01-.75.75h-.31l1.97 1.97a.75.75 0 001.06 0l2.22-2.22a.75.75 0 011.06 0l1.5 1.5a.75.75 0 01.22 1.28v-.01z" clipRule="evenodd" />
    </svg>
);

export const GlobeAltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 4.505a8.25 8.25 0 018.906 0 10.46 10.46 0 01-1.923 4.256.75.75 0 00.443 1.254l.11.033a.75.75 0 00.75-.224 8.22 8.22 0 012.353-2.61 8.25 8.25 0 010 7.562 8.22 8.22 0 01-2.353-2.61.75.75 0 00-.75-.224l-.11-.033a.75.75 0 00-.443 1.254c.48.71 1.03 1.365 1.637 1.954a8.25 8.25 0 01-8.906 0 10.46 10.46 0 011.923-4.256.75.75 0 00-.443-1.254l-.11-.033a.75.75 0 00-.75.224 8.22 8.22 0 01-2.353 2.61 8.25 8.25 0 010-7.562 8.22 8.22 0 012.353 2.61.75.75 0 00.75.224l.11-.033a.75.75 0 00.443-1.254A10.46 10.46 0 018.547 4.505z" clipRule="evenodd" />
    </svg>
);

export const SpeakerWaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.638 3.638 3.638 9.58 0 13.218a.75.75 0 11-1.06-1.06c2.955-2.955 2.955-7.758 0-10.698a.75.75 0 010-1.06z" />
      <path d="M16.416 7.274a.75.75 0 011.06 0c2.196 2.196 2.196 5.768 0 7.964a.75.75 0 11-1.06-1.06c1.513-1.513 1.513-3.978 0-5.492a.75.75 0 010-1.06z" />
    </svg>
);
  
export const SpeakerXMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.94 12l-2.22 2.22a.75.75 0 101.06 1.06L20 13.06l2.22 2.22a.75.75 0 101.06-1.06L21.06 12l2.22-2.22a.75.75 0 10-1.06-1.06L20 10.94l-2.22-2.22z" />
    </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

export const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

export const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 2.25c-3.98 0-7.25 3.27-7.25 7.25 0 4.34 7.25 11.25 7.25 11.25s7.25-6.91 7.25-11.25C19.25 5.52 15.98 2.25 12 2.25zM12 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
);

export const OmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.6,12.2a.8.8,0,0,1-.8.7h-.8a2,2,0,0,1-2-1.9,4.3,4.3,0,0,0-4-3.4,4.2,4.2,0,0,0-4.2,4.2,4.1,4.1,0,0,0,4.2,4.1,4.8,4.8,0,0,0,2.9-1l1,1a.8.8,0,0,1,0,1.1.8.8,0,0,1-1.1,0l-1.1-1.1a5.8,5.8,0,0,1-4.2,1.6,5.8,5.8,0,0,1,0-11.6,5.9,5.9,0,0,1,5.8,5.8,1.9,1.9,0,0,0,1.9,1.9h.4a.8.8,0,0,1,.7.8Zm-9.3-5.3A1.5,1.5,0,0,1,9.8,5.4a1.4,1.4,0,0,1,1.4,1.4,1.5,1.5,0,0,1-1.5,1.5A1.4,1.4,0,0,1,8.3,6.9Z" />
    </svg>
);

export const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.586 4.5a3.75 3.75 0 10-5.303 5.303l-1.5 1.5a.75.75 0 001.06 1.06l1.5-1.5a2.25 2.25 0 013.182-3.182l3.652 3.652a2.25 2.25 0 01-3.182 3.182l-1.5 1.5a.75.75 0 001.06 1.06l1.5-1.5a3.75 3.75 0 005.303-5.303l-3.652-3.652z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M4.5 12.586a3.75 3.75 0 005.303 5.303l1.5-1.5a.75.75 0 00-1.06-1.06l-1.5 1.5a2.25 2.25 0 01-3.182-3.182l3.652-3.652a2.25 2.25 0 013.182 3.182l1.5-1.5a.75.75 0 00-1.06-1.06l-1.5 1.5a3.75 3.75 0 00-5.303-5.303l-3.652 3.652z" clipRule="evenodd" />
    </svg>
);

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75v1.503a11.233 11.233 0 015.19 2.691c1.455 1.34 2.31 3.183 2.31 5.186 0 2.003-.855 3.846-2.31 5.186a11.233 11.233 0 01-5.19 2.691v1.503a.75.75 0 01-1.5 0v-1.503a11.233 11.233 0 01-5.19-2.691c-1.455-1.34-2.31-3.183-2.31-5.186 0-2.003.855 3.846 2.31-5.186A11.233 11.233 0 0111.25 3.753V2.25a.75.75 0 01.75-.75zm-1.03 13.28a.75.75 0 001.06 0l4.25-4.25a.75.75 0 00-1.06-1.06L11.5 12.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25z" clipRule="evenodd" />
    </svg>
);

export const FaceSmileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
    </svg>
);

export const FaceFrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.5a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
    </svg>
);

export const FaceAnxiousIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 16.03a4.502 4.502 0 00-7.82 0M9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
    </svg>
);

export const FaceNeutralIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
    </svg>
);

export const FaceAngryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 16.5l-9-9M7.5 16.5l9-9" />
    </svg>
);

export const FaceExcitedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 14.83a4.5 4.5 0 01-7.82 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
    </svg>
);

export const FaceReflectiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z" />
    </svg>
);

export const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
  </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const ChartPieIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

export const MegaphoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6H21M4.5 10.5H15M4.5 10.5L8.25 6H4.5v4.5zM4.5 10.5L8.25 15H4.5v-4.5zM15 10.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
    </svg>
);

export const PresentationChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
);

export const CurrencyDollarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const FingerPrintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565m-1.961 1.961a2.25 2.25 0 01-2.976 1.133 2.25 2.25 0 00-2.976 1.133m8.644-9.644a5.98 5.98 0 01-3.568-2.05m3.568 2.05a5.98 5.98 0 00-3.568-2.05m-3.568 2.05a5.98 5.98 0 01-3.568 2.05m3.568-2.05a5.98 5.98 0 00-3.568 2.05" />
    </svg>
);

export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

export const FlagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
);

export const CpuChipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.625 1.5H9a.375.375 0 01.375.375v1.875c0 1.036.84 1.875 1.875 1.875H12.75a3.75 3.75 0 013.75 3.75v1.5c0 1.036.84 1.875 1.875 1.875H20.25a.375.375 0 01.375.375v3.375a.375.375 0 01-.375.375h-1.875a1.875 1.875 0 01-1.875 1.875v1.5a3.75 3.75 0 01-3.75 3.75H9a.375.375 0 01-.375-.375v-1.875a1.875 1.875 0 01-1.875-1.875H4.875A3.75 3.75 0 011.125 16.5v-1.5a1.875 1.875 0 011.875-1.875H4.875a.375.375 0 01.375-.375V9.375a.375.375 0 01-.375-.375h-1.875A1.875 1.875 0 011.125 7.125v-3.375a.375.375 0 01.375-.375h1.875A1.875 1.875 0 015.25 1.5H5.625z" clipRule="evenodd" />
    </svg>
);

export const WifiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M1.371 8.143c5.858-5.857 15.356-5.857 21.213 0a.75.75 0 010 1.061l-.53.53a.75.75 0 01-1.06 0c-4.98-4.979-13.053-4.979-18.032 0a.75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.182 3.182c4.1-4.1 10.749-4.1 14.85 0a.75.75 0 010 1.06l-.53.53a.75.75 0 01-1.062 0 8.25 8.25 0 00-11.667 0 .75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.204 3.182a6 6 0 018.486 0 .75.75 0 010 1.061l-.53.53a.75.75 0 01-1.061 0 3.75 3.75 0 00-5.304 0 .75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.182 3.182a1.5 1.5 0 012.122 0 .75.75 0 010 1.06l-.53.53a.75.75 0 01-1.061 0l-.53-.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

export const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
    </svg>
);

export const CubeTransparentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.315 2c.77 0 1.505.328 2.033.89l8.01 8.503c1.114 1.183.27 3.107-1.351 3.107H3c-1.62 0-2.466-1.924-1.351-3.107l8.01-8.503A2.766 2.766 0 0112.315 2zm.618 1.837a1.266 1.266 0 00-.932-.408 1.266 1.266 0 00-.931.408l-8.01 8.503a.266.266 0 00.193.445h17.495a.266.266 0 00.193-.445l-8.009-8.503z" clipRule="evenodd" />
        <path d="M2.25 16.5a.75.75 0 01.75-.75h18a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-18a.75.75 0 01-.75-.75V16.5z" />
    </svg>
);

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 00.5.707A9.735 9.735 0 006 21a9.707 9.707 0 005.25-1.533.75.75 0 000-1.332A8.217 8.217 0 016 18a8.235 8.235 0 01-2.25-.333V5.167c.964.225 1.956.333 3 .333a8.217 8.217 0 005.25-1.967.75.75 0 000-1.332z" />
      <path d="M12.75 4.533A9.707 9.707 0 0018 3a9.735 9.735 0 003.25.555.75.75 0 01.5.707v14.25a.75.75 0 01-.5.707A9.735 9.735 0 0118 21a9.707 9.707 0 01-5.25-1.533.75.75 0 010-1.332A8.217 8.217 0 0018 18a8.235 8.235 0 002.25-.333V5.167c-.964.225-1.956.333-3 .333a8.217 8.217 0 00-5.25-1.967.75.75 0 000-1.332z" />
    </svg>
);

// New Icons for System Health Dashboard
export const ActivityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-2.17-5.441 1.125 1.125 0 00-1.666-1.516 3 3 0 01-3.458.286 3 3 0 00-3.132.286 3 3 0 01-3.458-.286 1.125 1.125 0 00-1.666 1.516A3 3 0 012.25 21v-.375C2.25 19.86 2.94 18.75 4.125 18.75h.75c1.105 0 2 .895 2 2v.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 012.25 21.5v-16.625C2.25 3.84 3.089 3 4.125 3h15.75c1.035 0 1.875.84 1.875 1.875v7.5c0 1.035-.84 1.875-1.875 1.875h-.75a1.125 1.125 0 00-1.125 1.125v1.5c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875v-7.5C22.125 3.84 21.286 3 20.25 3H4.125z" clipRule="evenodd" />
        <path d="M10.08 15.36a.75.75 0 011.09.243l1.26 2.108 2.37-4.267a.75.75 0 011.345.668l-3 5.4a.75.75 0 01-1.28-.048l-1.312-2.185-1.23 1.845a.75.75 0 01-1.248-.832l1.765-2.648a.75.75 0 01.24-.285z" />
    </svg>
);

export const ServerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-9a2.25 2.25 0 012.25-2.25H9zM13.875 3C12.84 3 12 3.84 12 4.875v1.5c0 1.036.84 1.875 1.875 1.875h4.5c1.036 0 1.875-.84 1.875-1.875v-1.5C20.25 3.84 19.41 3 18.375 3h-4.5zM13.875 15c-1.035 0-1.875.84-1.875 1.875v1.5c0 1.035.84 1.875 1.875 1.875h4.5c1.036 0 1.875-.84 1.875-1.875v-1.5C20.25 15.84 19.41 15 18.375 15h-4.5z" />
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);

export const SignalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M1.5 12a1.5 1.5 0 113 0V9a1.5 1.5 0 11-3 0v3zM7.5 12a1.5 1.5 0 113 0V6a1.5 1.5 0 11-3 0v6zM13.5 12a1.5 1.5 0 113 0V3a1.5 1.5 0 11-3 0v9zM19.5 12a1.5 1.5 0 113 0V9a1.5 1.5 0 11-3 0v3z" />
    </svg>
);

export const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);

export const ArrowRightOnRectangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);
