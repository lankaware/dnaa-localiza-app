import React, { useState, useEffect } from "react";


const CreateProposalLayout = props => {
  return (
    props.locationsList.map(location => {
      return (
        <table style={{ 'width': '80vw', 'marginLeft': '5vw' }} >
          <tbody>
            <tr><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td></tr>
            <tr >
              <td style={{ 'width': '50%' }}>{location.locationName}</td>
              <td>{location.dayValue}</td> 
            </tr>
            <tr><td>&nbsp;</td></tr>
          </tbody>
        </table>
      )
    })
  )
}

export default CreateProposalLayout