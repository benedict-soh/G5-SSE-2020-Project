import React, {Component, useState, useEffect} from 'react';
import NavigationTopBar from '../navigation/NavigationTopBar'
import {Route, withRouter, Switch, useParams} from "react-router-dom";
import '../App.css';
import CandidateForm from "./candidateForm"

export default function CandidateEdit(props) {
  const id = props.match.params.id;
  const [candidate, setCandidate] = useState('');

  useEffect(() => {
    if(id) {
      fetch('/candidates/'+id).then(response =>
        response.json().then(data => {
          console.log(data);
          setCandidate(data);
        })
      );
    }
  }, [])

  return (
    <CandidateForm candidate={candidate} candidate_id={id} />
  )
}
