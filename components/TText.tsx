import React, { ReactNode } from "react";
import { Text, TextProps } from "react-native";
import { useTranslation } from "react-i18next";

interface TTextProps extends TextProps {
  children: ReactNode;
  values?: Record<string, any>; 
}

export default function TText({ children, values = {}, style, ...props }: TTextProps) {
  const { t } = useTranslation();

  let content: ReactNode = children;

  if (typeof children === "string") {
    content = t(children, values);
  }

  return (
    <Text style={style} {...props}>
      {content}
    </Text>
  );
}
