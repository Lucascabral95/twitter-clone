import React from "react";
import type { Metadata } from "next";
import EstructuraMain from "@/components/EstructuraMain/EstructuraMain";
import BotonPosteoFlotante from "@/components/BotonPosteoFlotante/BotonPosteoFlotante";
import BotonBusquedaFlotante from "@/components/BotonPosteoFlotante/BotonBusquedaFlotante";
import FooterInterior from "@/components/Footer/FooterInterior";

export const metadata: Metadata = {
    title: "Feed de Posteos - Twitter",
    description:
        "Descubre los últimos posteos sobre tecnología, innovación y tendencias del sector. Unite a la conversación con otros entusiastas.",
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <EstructuraMain>
            {children}
            <BotonPosteoFlotante />
            <BotonBusquedaFlotante />
            <FooterInterior />
        </EstructuraMain>
    );
};

export default HomeLayout;
