import React, { useState, useEffect } from "react";
// import FormData from "form-data";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
// import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";
//import {useRouter} from "next/navigation";

import { VotingAddress, VotingAddressABI } from "./constants";
// import dotenv from "dotenv";
// dotenv.config();

// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const votingTitle = "Gymkhana Voting Application";
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

  const [error, setError] = useState("");
  const highestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install Metamask");

    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
    } else {
      setError("Please install Metamask then Connect & Reload ");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return setError("Please Install Metamask");

    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(account[0]);
  };

  // const uploadToIPFS = async (file) => {
  //   try {
  //     const added = await client.add({ content: file });
  //     const url = `https://ipfs.infura.io/ipfs/${added.path}`;

  //     return url;
  //   } catch (error) {
  //     setError("Error uploading file");
  //   }
  // };

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `c7dbacd9ca6cd0ab9623`,
            pinata_secret_api_key: `41052cb7c9cec969eb79e63dfdea70cfa1bcbad92acd9d33d1e0800552796c40`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        return ImgHash;
      } catch (error) {
        console.log("Unable to upload image to Pinata");
      }
    }
  };

  const uploadToIPFSCandidate = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `c7dbacd9ca6cd0ab9623`,
            pinata_secret_api_key: `41052cb7c9cec969eb79e63dfdea70cfa1bcbad92acd9d33d1e0800552796c40`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        return ImgHash;
      } catch (error) {
        console.log("Unable to upload image to Pinata");
      }
    }
  };

  const createVoter = async (formInput, fileUrl, router) => {
    try {
      const { name, address, position } = formInput;
      if (!name || !address || !position) {
        return setError("Input data is missing");
      }

      //Connection smart contract
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({ name, address, position, image: fileUrl });
      // const added = await client.add(data);

      // // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // const url = "hfas;dkhfjkh";
      // const voter = await contract.voterRight(address, name, url, fileUrl);
      // voter.wait();

      // console.log(voter);
      // // router.push("/voterList");

      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5OWVlN2IxZS0yOTE2LTRhZWEtYTAxZS02YmZjOTY4ODNjYjEiLCJlbWFpbCI6IjIwamUwOTk4QGNzZS5paXRpc20uYWMuaW4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzdkYmFjZDljYTZjZDBhYjk2MjMiLCJzY29wZWRLZXlTZWNyZXQiOiI0MTA1MmNiN2M5Y2VjOTY5ZWI3OWU2M2RmZGVhNzBjZmExYmNiYWQ5MmFjZDlkMzNkMWUwODAwNTUyNzk2YzQwIiwiaWF0IjoxNzE1MDY3OTk0fQ.uOfRrUnaQ6pnAHr6w46Cn7l5Jb6PyEwG71kpmNyUZe0`,
          pinata_api_key: `c7dbacd9ca6cd0ab9623`,
          pinata_secret_api_key: `41052cb7c9cec969eb79e63dfdea70cfa1bcbad92acd9d33d1e0800552796c40`,
          "Content-Type": "application/json",
        },
      });
      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      const voter = await contract.voterRight(address, name, url, fileUrl);
      voter.wait();
      console.log(voter);
      router.push("/voterList");
    } catch (error) {
      setError("Error in creating voter");
    }
  };

  const getAllVoterData = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);
      // console.log(voterAddress);
      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterdata(el);
        pushVoter.push(singleVoterData);
        // console.log(singleVoterData);
      });

      //Check for error
      const voterList = await contract.getVoterLength();
      // console.log(voterList.toNumber());
      setVoterLength(voterList.toNumber());
    } catch (error) {
      setError("something went wrong");
    }
  };
  // console.log(voterAddress);

  // useEffect(() => {
  //   getAllVoterData();
  // }, []);

  const giveVote = async (id) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const setCandidate = async (candidateForm, fileUrl, router) => {
    try {
      const { name, address, age } = candidateForm;
      if (!name || !address || !age) {
        return setError("Input data is missing");
      }

      //Connection smart contract
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({ name, address, image: fileUrl, age });
      // const added = await client.add(data);

      // // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // const url = "hfas;dkhfjkh";
      // const voter = await contract.voterRight(address, name, url, fileUrl);
      // voter.wait();

      // console.log(voter);
      // // router.push("/voterList");

      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5OWVlN2IxZS0yOTE2LTRhZWEtYTAxZS02YmZjOTY4ODNjYjEiLCJlbWFpbCI6IjIwamUwOTk4QGNzZS5paXRpc20uYWMuaW4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzdkYmFjZDljYTZjZDBhYjk2MjMiLCJzY29wZWRLZXlTZWNyZXQiOiI0MTA1MmNiN2M5Y2VjOTY5ZWI3OWU2M2RmZGVhNzBjZmExYmNiYWQ5MmFjZDlkMzNkMWUwODAwNTUyNzk2YzQwIiwiaWF0IjoxNzE1MDY3OTk0fQ.uOfRrUnaQ6pnAHr6w46Cn7l5Jb6PyEwG71kpmNyUZe0`,
          pinata_api_key: `c7dbacd9ca6cd0ab9623`,
          pinata_secret_api_key: `41052cb7c9cec969eb79e63dfdea70cfa1bcbad92acd9d33d1e0800552796c40`,
          "Content-Type": "application/json",
        },
      });
      const ipfs = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      const candidate = await contract.setCandidate(
        address,
        age,
        name,
        fileUrl,
        ipfs
      );
      candidate.wait();
      console.log(candidate);
      router.push("/");
    } catch (error) {
      setError("something went wrong");
    }
  };

  const getNewCandidate = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const allCandidate = await contract.getCandidate();
      console.log(allCandidate);

      allCandidate.map(async (el) => {
        const singleCandidateData = await contract.getCandidatedata(el);
        console.log(singleCandidateData);
        pushCandidate.push(singleCandidateData);
        candidateIndex.push(singleCandidateData[2].toNumber());
      });

      const allCandidateLength = await contract.getCandidateLength();
      setCandidateLength(allCandidateLength.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNewCandidate();
  });

  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getNewCandidate,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray,
        uploadToIPFSCandidate,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
