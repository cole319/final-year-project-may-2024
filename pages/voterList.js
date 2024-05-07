import React, { useState, useEffect, useContext } from "react";

import VoterCard from "../components/VoterCard/voterCard";
import Style from "../styles/voterList.module.css";
import { VotingContext } from "../context/Voter";

const voterList = () => {
  const { getAllVoterData, voterArray } = useContext(VotingContext);
  useEffect(() => {
    getAllVoterData();
  }, []);
  return (
    <div className={Style.voterList}>
      <VoterCard voterArray={voterArray} />
    </div>
  );
};

export default voterList;
