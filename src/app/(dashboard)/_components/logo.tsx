import Image from "next/image";
import React from "react";
import logo from "../../../../public/logoipsum-292.svg";

export default function Logo() {
  return <Image height={50} width={50} alt="logo" src={logo} />;
}
