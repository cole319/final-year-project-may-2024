import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoter.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const allowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();
  const { uploadToIPFS } = useContext(VotingContext);

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbps; {formInput.name}</span>
              </p>
              <p>
                Add: &nbps; <span>{formInput.address}</span>
              </p>
              <p>
                Pos: &nbps; <span>{formInput.position}</span>
              </p>
            </div>
          </div>
        )}
        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create Candidate for Voting</h4>
              <p>Gymkhana Voting</p>
              <p className={Style.sideInfo_para}>Contract Candidate</p>
            </div>
            <div className={Style.car}>
              {/* {voterArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src="" alt="Profile Photo" />
                  </div>
                  <div className={Style.card_info}>
                    <p>Name</p>
                    <p>Address</p>
                    <p>Details</p>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        )}
      </div>
      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create New Voter</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default allowedVoters;
