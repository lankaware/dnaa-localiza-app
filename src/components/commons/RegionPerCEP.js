export function regionPerCEP (CepArray) {
    let CEP = CepArray[0];
    let regionNum = CEP.substr(0,2);
    let regionName;
    switch (regionNum){
        case "01":
            regionName = "Centro";
            break;
        case "02":
            regionName = "Zona Norte";
            break;
        case "03" || "08":
            regionName = "Zona Leste";
            break;
        case "04":
            regionName = "Zona Sul";
            break;
        case "05":
            regionName = "Zona Oeste";
            break;
        default:
            regionName = "Região não definida"
    }
    return regionName;
}