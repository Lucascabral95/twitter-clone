import React from "react";
import type { Metadata } from "next";
import EstructuraMain from "@/components/EstructuraMain/EstructuraMain";
import BotonPosteoFlotante from "@/components/BotonPosteoFlotante/BotonPosteoFlotante";
import BotonBusquedaFlotante from "@/components/BotonPosteoFlotante/BotonBusquedaFlotante";
import FooterInterior from "@/components/Footer/FooterInterior";
import BotonLogoutFlotante from "@/components/BotonPosteoFlotante/BotonLogoutFlotante";

export const metadata: Metadata = {
  title: "Tweets, Interacciones y Estadísticas",
  description:
    "Explora los perfiles de usuario en nuestra plataforma. Descubre tweets publicados, interacciones recientes, estadísticas de actividad y conexiones con otros usuarios. Una sección diseñada para ofrecer una visión integral de cada miembro de la comunidad.",
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <EstructuraMain>
      {children}
      <BotonPosteoFlotante />
      <BotonBusquedaFlotante />
      <BotonLogoutFlotante />
      <FooterInterior />
    </EstructuraMain>
  );
};

export default HomeLayout;
