import React, { useState, useEffect } from "react";
import { getList } from '../../services/apiconnect'
import logo from '../../ReportLogo.png'
import { List } from "@mui/material";
import CreateProposalLayout from "./CreateLocationsLayout";


const ProposalLayout = React.forwardRef((props, ref) => {
  const [fee, feeSet] = useState();
  const quizId = props.quizId
  const discResult = props.discResult
  const [locationsList, locationsListSet] = useState([]);
  const [update, updateSet] = useState();
  let tempLocationList = [];

  // useEffect(() => {

  // }, [])

  // useEffect(() => {
  //   updateSet(false);
  // }, [locationsList])

  const getLocationInfo = (location) => {
    getList(`locationid/${location.location_id}`)
      .then(values => {
        let line = {
          locationName: location.location_name,
          address: `${location.location_address_type} ${location.location_address}, ${location.location_number} - ${values.record.neighborhood}`,
          // dayValue: values.record.dayValue.toFixed(2) || 0,
          // NFValue: (values.record.dayValue / 0.825 * 0.175).toFixed(2) || 0,
          // totalValue: values.record.dayValue + ((values.record.dayValue / 0.825 * 0.175).toFixed(2))|| 0,
          // weekendValue: values.record.weekendValue.toFixed(2)|| 0,
          // fifteenValues: values.record.fifteenValue.toFixed(2)|| 0,
          // monthValue: values.record.monthValue.toFixed(2),
          // otherValues: values.record.otherValues,
          disponibility: values.record.disponibility
        }
        return line
      }).then(line => {
        tempLocationList.push(line);
      })
  }


  const executeBefore = async () => {
    for (let location of props.list) {
      getLocationInfo(location);
    }
    // locationsListSet(tempLocationList);
    console.log("aqui");
  }

  // executeBefore();

  // Apenas para testes, posteriormente apagar
  // let location = {
  //   address: "Avenida Paulista, 1100 - Centro",
  //   dayValue: 500,
  //   NFValue: 106.06,
  //   totalValue: 606.06,
  //   disponibility: "29/03 - 30/03 - 31/03",
  //   fifteenValues: 1300,
  //   locationName: ['B.LEM'],
  //   monthValue: 2500,
  //   otherValues: "",
  //   weekendValue: 250,
  // }
  await executeBefore()
    .then(_ => {
      return (
        <div ref={ref} style={{ 'marginLeft': '20px' }}>
          <img src={logo} alt='Logo' weight='205' height='50' />
          {/* Introdução */}

          <table style={{ 'width': '80vw', 'marginLeft': '5vw' }} >
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

          <table style={{ 'width': '80vw', 'marginLeft': '5vw' }} >
            <tbody>
              <tr>
                <td class="layout-header first-header">Nome do Local</td>
                <td class="layout-header">Endereço</td>
                <td class="layout-header">Valor Diária</td>
                <td class="layout-header">Nota Fiscal</td>
                <td class="layout-header">Total</td>
                <td class="layout-header">Total com FEE</td>
                <td class="layout-header">Observação</td>
                <td id="last-header" class="layout-header">Disponibilidade</td>
              </tr>
              {tempLocationList.map((location) => {
                console.log("Renderizou")
                return (
                  <>
                    <tr><td colSpan={8} ><hr /></td></tr>
                    <tr >
                      <td >{location.locationName}</td>  {/* style={{ 'width': '50%' }} */}
                      <td>{location.address}</td>
                      <td>{`R$${location.dayValue}`}</td>
                      <td>{`R$${location.NFValue}`}</td>
                      <td>{`R$${location.totalValue}`}</td>
                      <td>{`R$${(location.totalValue * (1 + parseFloat(props.redeveloperFee) / 100)).toFixed(2)}`}</td>
                      <td>
                        <p>{`Fim de Semana: R$${location.weekendValue}`}</p>
                        <p>{`15 dias: R$${location.fifteenValues} `}</p>
                        <p>{`30 dias: R$${location.monthValue}`}</p>
                      </td>
                      <td>{`${location.disponibility}`}</td>
                    </tr>
                    <tr><td></td></tr>
                  </>
                )
              })
              }

            </tbody>
          </table>
        </div >
      )
    })
})

export default ProposalLayout