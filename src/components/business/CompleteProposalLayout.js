import React, { useState, useEffect } from "react";
import { getList } from '../../services/apiconnect'
import logo from '../../ReportLogo.png'
import { List } from "@mui/material";
import CreateProposalLayout from "./CreateLocationsLayout";


const CompleteProposalLayout = React.forwardRef((props, ref) => {
  const [fee, feeSet] = useState();
  const [locationsList, locationsListSet] = useState([]);
  const [update, updateSet] = useState(false);

  useEffect(() => {
    // Apenas para testes, posteriormente apagar
    console.log('props.list', props.list)
    var tempLocationList = [];
    for (let location of props.list) {
      let line = {
        locationType: location.location_type,
        locationName: location.location_name,
        address: `${location.location_address_type} ${location.location_address}, ${location.location_number} - ${location.location_neighborhood}`,
        dayValue: (location.dayValue || 0),
        NFValue: (parseFloat((location.dayValue / 0.825 * 0.175).toFixed(2)) || 0 ),
        // totalValue: ((location.dayValue + (location.dayValue  / 0.825 * 0.175)) || 0),
        weekendValue: (location.weekendValue || 0)/*.toFixed(2)*/,
        fifteenValues: (location.fifteenValue || 0)/*.toFixed(2)*/,
        monthValue: (location.monthValue || 0)/*.toFixed(2)*/,
        otherValues: location.otherValues,
        disponibility: location.disponibility
      }
      // console.log({line})
      tempLocationList.push(line);
      // console.log('tempLocationList', tempLocationList)
    }

    locationsListSet(tempLocationList);

  }, [])

  return (
    <div ref={ref} style={{ 'marginLeft': '20px' }}>
      <img src={logo} alt='Logo' weight='205' height='50' />
      {/* Introdução */}

      <table style={{ 'width': '80vw', 'marginLeft': '3vw' }} >
        <tbody>
          <tr><td>&nbsp;</td></tr>
          <tr>
            <td style={{ 'width': '50%' }}>Incorporadora: {props.redeveloperName}</td>
          </tr>
          <hr />
          <tr>
            <td style={{ 'width': '50%' }}>Produto: {props.reprojectName}</td>
          </tr>
          <hr />
          <tr>
            <td style={{ 'width': '50%' }}>Endereço: {props.eventAddress}</td>
          </tr>
          <hr />
          <tr><td>&nbsp;</td></tr>
        </tbody>
      </table>

      {/* map para seções  */}

      <table style={{ 'width': '80vw', 'marginLeft': '3vw', 'borderCollapse': 'collapse' }} >
        <tbody>
          <tr>
          <td className="layout-header first-header">Tipo de Local</td>
            <td className="layout-header">Nome do Local</td>
            <td className="layout-header">Endereço</td>
            <td className="layout-header">Valor Diária</td>
            <td className="layout-header">Nota Fiscal</td>
            <td className="layout-header">Total</td>
            <td className="layout-header">Total com FEE</td>
            <td className="layout-header">Observação</td>
            <td id="last-header" className="layout-header">Disponibilidade</td>
          </tr>
          {locationsList.map((location, index) => {
            console.log('locationsList', locationsList)
            console.log('location', location)
            return (
              // <>
              // <tr><td colSpan={8} ><hr /></td></tr>
              <tr key={index} className="layout-item">
                <td>{location.locationType}</td>
                <td >{location.locationName}</td>  {/* style={{ 'width': '50%' }} */}
                <td>{location.address}</td>
                <td>{`R$${location.dayValue}`}</td>
                <td>{`R$${location.NFValue}`}</td>
                <td>{`R$${parseFloat(location.dayValue) + parseFloat(location.NFValue)}`}</td>
                <td>{`R$${((parseFloat(location.dayValue) + parseFloat(location.NFValue)) * (1 + parseFloat(props.redeveloperFee) / 100)).toFixed(2)}`}</td>
                <td>
                  <p>{`Fim de Semana: R$${location.weekendValue}`}</p>
                  <p>{`15 dias: R$${location.fifteenValues} `}</p>
                  <p>{`30 dias: R$${location.monthValue}`}</p>
                </td>
                <td><p style={{'maxWidth': '15vw'}}>{`${location.disponibility}`}</p></td>
              </tr>
              // <tr><td></td></tr>
              // </>
            )
          })
          }

        </tbody>
      </table>
    </div >
  )
})


export default CompleteProposalLayout