import React, { useState, useEffect } from "react";
import { getList } from '../../services/apiconnect'
import logo from '../../ReportLogo.png'

const ProposalLayout = React.forwardRef((props, ref) => {

  const quizId = props.quizId
  const discResult = props.discResult
  const [baseText, baseTextSet] = useState('')
  const [condTextList, condTextListSet] = useState([])
  const [reportSections, reportSectionsSet] = useState([])
  // const reportRef = useRef()
  
  useEffect(() => {
    // getList(`quizid/${quizId}`)
    //   .then(item => {
    //     baseTextSet(item.record[0].baseText)
    //     condTextListSet(item.record[0].condTextList[0] || [])
    //     reportSectionsSet(item.record[0].reportSections[0] || [])
    //   })
  }, [])


  return (
    <div ref={ref} style={{ 'marginLeft': '20px' }}>
      <img src={logo} alt='Logo' weight='205' height='50' />
      {/* Introdução */}

      <table style={{ 'width': '80vw', 'marginLeft': '5vw' }} >
        <tbody>
          <tr><td>&nbsp;</td></tr>
          <tr >
            <td style={{ 'width': '50%' }}>{baseText}</td>
          </tr>
          <tr><td>&nbsp;</td></tr>
        </tbody>
      </table>

      {/* map para seções  */}
      {reportSections.map(section => {
        return (
          <table style={{ 'width': '80vw', 'marginLeft': '5vw' }} >
            <tbody>
              <tr><td>&nbsp;</td></tr>
              <tr><td>&nbsp;</td></tr>
              <tr >
                <td style={{ 'width': '50%' }}><strong>{section}</strong></td>
              </tr>
              <tr><td>&nbsp;</td></tr>

              {condTextList.map(item => {
                if (item.textSection !== section) return null
                return (
                  <tr >
                    <td style={{ 'width': '50%' }}>Item</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      }
      )}

    </div>
  )
})

export default ProposalLayout