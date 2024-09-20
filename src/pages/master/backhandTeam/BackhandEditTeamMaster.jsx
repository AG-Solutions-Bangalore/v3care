import React from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useParams } from "react-router-dom";

const BackhandEditTeamMaster = () => {
  const { id } = useParams();
  return (
    <Layout>
      <MasterFilter />
      <div>BackhandEditTeamMaster {id}</div>
    </Layout>
  );
};

export default BackhandEditTeamMaster;
