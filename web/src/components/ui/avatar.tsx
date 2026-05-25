import * as React from "react"
export const Avatar = ({ children }: any) => <div>{children}</div>;
export const AvatarImage = ({ src }: any) => <img src={src} alt="avatar" />;
export const AvatarFallback = ({ children }: any) => <div>{children}</div>;