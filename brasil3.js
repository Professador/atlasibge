var d2
window.onload = () => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?OrderBy=Nome')
        .then((res) => {
            res.json().then((dados1) => {
                //console.log(dados1[26])
                for (let i1 = 0; i1 < dados1.length; i1++) {
                    let opt = document.createElement('option')
                    opt.value = dados1[i1].id
                    opt.innerText = `${dados1[i1].nome} - ${dados1[i1].sigla}`
                    document.getElementById('estado').appendChild(opt)
                }
            }).then(() => {
                //console.log(document.getElementById('estado').value)
                pegaMuni(document.getElementById('estado').value, 'municipios', 'munic')
                getPop('N3', document.getElementById('estado').value, 'tabPopEst')
                getInfoB('N3', document.getElementById('estado').value, 'tabInfoB')
                getPip('N3', document.getElementById('estado').value, 'tabPibE')
                limpaTabela('tabPopMun')
                limpaTabela('muniNomes')
                //mapEst(document.getElementById('estado').value, 'map1')
                return true
            })
        })
}

async function pegaMuni(uf, elem, inp) {
    limpaTabela('tabPopMun')
    limpaTabela('muniNomes')
    getPop('N3', document.getElementById('estado').value, 'tabPopEst')
    getInfoB('N3', document.getElementById('estado').value, 'tabInfoB')
    getPip('N3', document.getElementById('estado').value, 'tabPibE')
    mapEst(uf, 'map1')
    const mun = document.getElementById(elem)
    document.getElementById(inp).value = ""
    //console.log(mun.options.length)
    mun.innerHTML = ""
    document.getElementById('distritos').innerHTML = ""
    //mun.options.length = 0

    await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then((res) => {
            res.json().then((dados2) => {
                for (let i1 = 0; i1 < dados2.length; i1++) {
                    let opt = document.createElement('option')
                    //opt.value = dados2[i1].id
                    opt.value = `${dados2[i1].nome}`
                    opt.setAttribute('data-value', dados2[i1].id)
                    mun.appendChild(opt)
                }
                //console.log(dados2)
                return true
            })
        })
}

async function pegaDist(muni, elem) {
    const mun = document.getElementById(elem)
    let idmuni
    let selector = document.querySelector('option[value="' + muni.value + '"]')
    if (selector) {
        idmuni = selector.getAttribute('data-value')
        //console.log(idmuni)
    }
    mun.innerHTML = ""
    if (!idmuni) {
        console.log('vazio')
        limpaTabela('tabPopMun')
        return
    }
    //getPop('N6', idmuni, 'tabPopMun')
    muniMap1(idmuni)
    pegaNomes(idmuni, 'muniNomes')
    document.getElementById('idmuni').innerHTML = idmuni
    tabPrev('prev', idmuni)
    getPop('N6', idmuni, 'tabPopMun')
    getInfoB('N6', idmuni, 'tabInfoBM')
    getPip('N6', idmuni, 'tabPibM')
    //console.log(idmuni)
    await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${idmuni}/distritos`)
        .then((res) => {
            res.json().then((dados2) => {
                for (let i1 = 0; i1 < dados2.length; i1++) {
                    let opt = document.createElement('option')
                    //opt.value = dados2[i1].id
                    opt.value = `${dados2[i1].id}`
                    opt.innerText = `${dados2[i1].id}-${dados2[i1].nome}`
                    mun.appendChild(opt)
                }
                //console.log(dados2)
                return true
            })
        })
}

async function getInfoB(tipo, localidade, elem) {
    //console.log(tipo, localidade)
    const mun = document.getElementById(elem)
    var url = `https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93%7C6318%7C614?localidades=N1[all]|${tipo}[${localidade}]`
    //console.log(url)
    await fetch(url)
        .then((res) => {
            res.json().then((dados2) => {
                var tab = mun
                tab.deleteRow(-1)
                tab.deleteRow(-1)
                tab.deleteRow(-1)
                let linha0 = document.createElement('tr')
                let linha1 = document.createElement('tr')
                let linha2 = document.createElement('tr')
                var series = Object.keys(dados2[0].resultados[0].series[0].serie)
                //console.log(series)
                let cell0 = document.createElement('th')
                cell0.setAttribute('colspan', 6)
                cell0.innerText = "População medida no censo"
                linha0.appendChild(cell0)
                let ll = ['Censo', 'População', 'Área', 'Densidade']
                for (let i1 = 0; i1 < ll.length; i1++) {
                    let cell = document.createElement('th')
                    cell.innerText = ll[i1]
                    linha1.appendChild(cell)
                }
                for (let i1 = 0; i1 < series.length; i1++) {
                    let cell1 = document.createElement('th')
                    let cell2 = document.createElement('td')
                    let cell3 = document.createElement('td')
                    let cell4 = document.createElement('td')
                    let pb = Number(dados2[0].resultados[0].series[0].serie[series[i1]])
                    let pe = Number(dados2[0].resultados[0].series[1].serie[series[i1]])
                    let ppb = (pe / pb) * 100
                    let ab = Number(dados2[1].resultados[0].series[0].serie[series[i1]])
                    let ae = Number(dados2[1].resultados[0].series[1].serie[series[i1]])
                    let apb = (ae / ab) * 100
                    let db = Number(dados2[2].resultados[0].series[0].serie[series[i1]])
                    let de = Number(dados2[2].resultados[0].series[1].serie[series[i1]])
                    let dpb = (de / db) * 100
                    cell1.innerText = `${series[i1]}`
                    cell2.innerText = `${pe.toLocaleString('pt-br')} (${ppb.toFixed(3).toLocaleString('pt-br')}%)`
                    cell3.innerText = `${ae.toLocaleString('pt-br')} (${apb.toFixed(3).toLocaleString('pt-br')}%)`
                    cell4.innerText = `${de.toLocaleString('pt-br')} (${dpb.toFixed(3).toLocaleString('pt-br')}%)`
                    linha2.appendChild(cell1)
                    linha2.appendChild(cell2)
                    linha2.appendChild(cell3)
                    linha2.appendChild(cell4)
                    tab.appendChild(linha0)
                    tab.appendChild(linha1)
                    tab.appendChild(linha2)
                }
                //mun.appendChild(tab)
                //console.log(dados2)
                return true
            })
        })
}

async function getPop(tipo, localidade, elem) {
    //console.log(tipo, localidade)
    const mun = document.getElementById(elem)
    var url = `https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2001|2002|2003|2004|2005|2006|2008|2009|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021/variaveis/9324?localidades=${tipo}[${localidade}]`
    //console.log(url)
    await fetch(url)
        .then((res) => {
            res.json().then((dados2) => {
                var tab = mun
                tab.deleteRow(-1)
                tab.deleteRow(-1)
                tab.deleteRow(-1)
                let linha0 = document.createElement('tr')
                let linha1 = document.createElement('tr')
                let linha2 = document.createElement('tr')
                var series = Object.keys(dados2[0].resultados[0].series[0].serie)
                for (let i1 = 0; i1 < series.length; i1++) {
                    let cell1 = document.createElement('th')
                    let cell2 = document.createElement('td')
                    cell1.innerText = `${series[i1]}`
                    cell2.innerText = Number(dados2[0].resultados[0].series[0].serie[series[i1]]).toLocaleString('pt-br')
                    linha1.appendChild(cell1)
                    linha2.appendChild(cell2)
                }
                let cell0 = document.createElement('th')
                cell0.setAttribute('colspan', series.length)
                cell0.innerText = "EVOLUÇÃO DA POPULAÇÃO ESTIMADA"
                linha0.appendChild(cell0)
                tab.appendChild(linha0)
                tab.appendChild(linha1)
                tab.appendChild(linha2)
                //mun.appendChild(tab)
                //console.log(dados2)
                return true
            })
        })
}

async function getPip(tipo, localidade, elem) {
    //console.log(tipo, localidade)
    const mun = document.getElementById(elem)
    var url = `https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021|2022|2023/variaveis/37?localidades=${tipo}[${localidade}]`
    //console.log(url)
    await fetch(url)
        .then((res) => {
            res.json().then((dados2) => {
                var tab = mun
                tab.deleteRow(-1)
                tab.deleteRow(-1)
                tab.deleteRow(-1)
                let linha0 = document.createElement('tr')
                let linha1 = document.createElement('tr')
                let linha2 = document.createElement('tr')
                var series = Object.keys(dados2[0].resultados[0].series[0].serie)
                for (let i1 = 0; i1 < series.length; i1++) {
                    let cell1 = document.createElement('th')
                    let cell2 = document.createElement('td')
                    //let valor = ""
                    let sp1 =document.createElement('span')
                    let sp2 =document.createElement('span')
                    let sp3 =document.createElement('span')
                    if(i1>0){
                        let pibA = Number(dados2[0].resultados[0].series[0].serie[series[i1-1]])
                        let pibC = Number(dados2[0].resultados[0].series[0].serie[series[i1]])
                        let pibP = ((pibC - pibA)/pibA) * 100
                        //valor = `${pibC.toLocaleString('pt-br')} (${pibP.toFixed(1).toLocaleString('pt-br')}%)`
                        sp1.innerText = `${pibC.toLocaleString('pt-br')} (`
                        if(pibP < 0){
                            sp2.style.color = "red"
                        }else{
                            sp2.style.color = "blue"
                        }
                        sp2.innerText = `${pibP.toFixed(1).toLocaleString('pt-br')}`
                        sp3.innerText = `%)`
                        cell2.appendChild(sp1)
                        cell2.appendChild(sp2)
                        cell2.appendChild(sp3)
                    }else{
                        cell2.innerText = Number(dados2[0].resultados[0].series[0].serie[series[i1]]).toLocaleString('pt-br')
                    }
                    cell1.innerText = `${series[i1]}`
                    //cell2.innerText = valor
                    linha1.appendChild(cell1)
                    linha2.appendChild(cell2)
                }
                let cell0 = document.createElement('th')
                cell0.setAttribute('colspan', series.length)
                cell0.innerText = "Produto Interno Bruto a preços correntes (em Mil Reais)"
                linha0.appendChild(cell0)
                tab.appendChild(linha0)
                tab.appendChild(linha1)
                tab.appendChild(linha2)
                //mun.appendChild(tab)
                //console.log(dados2)
                return true
            })
        })
}


//document.getElementById('final').innerText = d2.toString()
function limpaTabela(tabela) {
    var tab = document.getElementById(tabela)
    for (let i1 = 0; i1 < tab.rows.length; i1++) {
        tab.deleteRow(-1)
    }
    tab.deleteRow(-1)
}
async function mapEst(uf, dv) {
    div1 = document.getElementById(dv)
    div1.innerHTML = ""
    await fetch(`https://servicodados.ibge.gov.br/api/v3/malhas/estados/${uf}?formato=image/svg+xml&qualidade=maxima&intrarregiao=municipio`)
        .then((res) => res.text())
        .then((res) => {
            const span = document.createElement('span')
            span.innerHTML = res
            //console.log('uf',uf)
            const inLineSvg = span.getElementsByTagName('svg')[0]
            inLineSvg.setAttribute('width', '600')
            inLineSvg.setAttribute('height', '600')
            div1.appendChild(inLineSvg)
            return true
        }).then(() => { getActions() })
}
function muniMap1(muni) {
    paths = document.getElementsByClassName('munimarcado')
    for (let i1 = 0; i1 < paths.length; i1++) {
        paths[i1].classList.remove('munimarcado')
    }
    path1 = document.getElementById(muni)
    path1.classList.add('munimarcado')
}

function getActions() {
    const munis = document.getElementsByTagName('path')
    for (let i1 = 0; i1 < munis.length; i1++) {
        munis[i1].onclick = () => { municlicked(munis[i1].id) }
    }
}
function municlicked(idmuni) {
    let muninome;
    //console.log('ID: ', idmuni)
    let muniCampo = document.getElementById('munic')
    let selector = document.querySelector('option[data-value="' + idmuni + '"]')
    if (selector) {
        muninome = selector.getAttribute('value')
        //console.log('nome: ',muninome)
    }
    muniCampo.value = muninome
    limpaTabela('muniNomes')
    pegaDist(muniCampo, 'distritos')
}

async function pegaNomes(loc, tabela) {
    var tab = document.getElementById(tabela)
    for (let i = 0; i < 4; i++) {
        tab.deleteRow(-1)
    }
    await fetch(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/ranking?localidade=${loc}&sexo=f`)
        .then((res) => {
            res.json().then((dados3) => {
                let linha1 = document.createElement('tr')
                let linha2 = document.createElement('tr')
                var ranking = dados3[0].res
                for (let i1 = 0; i1 < ranking.length; i1++) {
                    let cell1 = document.createElement('th')
                    let cell2 = document.createElement('td')
                    cell1.innerText = `${ranking[i1].nome}`
                    cell2.innerText = Number(ranking[i1].frequencia).toLocaleString('pt-br')
                    linha1.appendChild(cell1)
                    linha2.appendChild(cell2)
                }
                tab.appendChild(linha1)
                tab.appendChild(linha2)
                return true
            })

        }
        )
    await fetch(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/ranking?localidade=${loc}&sexo=m`)
        .then((res) => {
            res.json().then((dados3) => {
                let linha1 = document.createElement('tr')
                let linha2 = document.createElement('tr')
                //console.log('aqui', dados3)
                var ranking = dados3[0].res
                for (let i1 = 0; i1 < ranking.length; i1++) {
                    let cell1 = document.createElement('th')
                    let cell2 = document.createElement('td')
                    cell1.innerText = `${ranking[i1].nome}`
                    cell2.innerText = Number(ranking[i1].frequencia).toLocaleString('pt-br')
                    linha1.appendChild(cell1)
                    linha2.appendChild(cell2)
                }
                tab.appendChild(linha1)
                tab.appendChild(linha2)
                return true
            })

        }
        )
}

async function tabPrev(tab, idmuni) {
    //console.log(tab, idmuni)
    var tt = document.getElementById(tab)
    for (let i = 0; i < 3; i++) {
        tt.deleteRow(-1)
    }
    var url = `https://apiprevmet3.inmet.gov.br/previsao/${idmuni}`
    await fetch(url).then((res) => {
        res.json().then((dados3) => {
            //console.log('pega: ', dados3)
            var diaKey = Object.keys(dados3[idmuni])
            //console.log(diaKey)
            let linha1 = document.createElement('tr')
            let linha2 = document.createElement('tr')
            let linha3 = document.createElement('tr')
            for (let i11 = 0; i11 < diaKey.length; i11++) {
                if (i11 < 2) {
                    let cell1 = document.createElement('th')
                    cell1.colSpan = 3
                    cell1.innerHTML = diaKey[i11] + "-" + dados3[idmuni][diaKey[i11]]['manha'].dia_semana
                    linha1.appendChild(cell1)
                    let manha = document.createElement('td')
                    let tarde = document.createElement('td')
                    let noite = document.createElement('td')
                    manha.innerHTML = 'Manhã'
                    tarde.innerHTML = 'Tarde'
                    noite.innerHTML = 'Noite'
                    linha2.appendChild(manha)
                    linha2.appendChild(tarde)
                    linha2.appendChild(noite)
                    let resumom = document.createElement('td')
                    let resumot = document.createElement('td')
                    let resumon = document.createElement('td')
                    let divgm = document.createElement('div')
                    let icom = document.createElement('img')
                    icom.width = "40"
                    icom.height = "40"
                    let r1m = document.createElement('p')
                    let divgt = document.createElement('div')
                    let icot = document.createElement('img')
                    icot.width = "40"
                    icot.height = "40"
                    let r1t = document.createElement('p')
                    let divgn = document.createElement('div')
                    let icon = document.createElement('img')
                    icon.width = "40"
                    icon.height = "40"
                    let r1n = document.createElement('p')
                    let tmaxm = document.createElement('p')
                    let tminm = document.createElement('p')
                    let tmaxt = document.createElement('p')
                    let tmint = document.createElement('p')
                    let tmaxn = document.createElement('p')
                    let tminn = document.createElement('p')
                    icom.src = dados3[idmuni][diaKey[i11]]['manha'].icone
                    r1m.innerText = dados3[idmuni][diaKey[i11]]['manha'].resumo
                    tmaxm.innerText = 'Max: ' + dados3[idmuni][diaKey[i11]]['manha'].temp_max + ', ' + dados3[idmuni][diaKey[i11]]['manha'].temp_max_tende
                    tminm.innerText = 'Min: ' + dados3[idmuni][diaKey[i11]]['manha'].temp_min + ', ' + dados3[idmuni][diaKey[i11]]['manha'].temp_min_tende
                    tmaxt.innerText = 'Max: ' + dados3[idmuni][diaKey[i11]]['tarde'].temp_max + ', ' + dados3[idmuni][diaKey[i11]].tarde.temp_max_tende
                    tmint.innerText = 'Min: ' + dados3[idmuni][diaKey[i11]].tarde.temp_min + ', ' + dados3[idmuni][diaKey[i11]].tarde.temp_min_tende
                    tmaxn.innerText = 'Max: ' + dados3[idmuni][diaKey[i11]]['noite'].temp_max + ', ' + dados3[idmuni][diaKey[i11]].noite.temp_max_tende
                    tminn.innerText = 'Min: ' + dados3[idmuni][diaKey[i11]].noite.temp_min + ', ' + dados3[idmuni][diaKey[i11]].noite.temp_min_tende
                    divgm.appendChild(icom)
                    divgm.appendChild(r1m)
                    divgm.appendChild(tmaxm)
                    divgm.appendChild(tminm)
                    resumom.appendChild(divgm)
                    linha3.appendChild(resumom)
                    icot.src = dados3[idmuni][diaKey[i11]]['tarde'].icone
                    r1t.innerText = dados3[idmuni][diaKey[i11]]['tarde'].resumo
                    divgt.appendChild(icot)
                    divgt.appendChild(r1t)
                    divgt.appendChild(tmaxt)
                    divgt.appendChild(tmint)
                    resumot.appendChild(divgt)
                    linha3.appendChild(resumot)
                    icon.src = dados3[idmuni][diaKey[i11]]['noite'].icone
                    r1n.innerText = dados3[idmuni][diaKey[i11]]['noite'].resumo
                    divgn.appendChild(icon)
                    divgn.appendChild(r1n)
                    divgn.appendChild(tmaxn)
                    divgn.appendChild(tminn)
                    resumon.appendChild(divgn)
                    linha3.appendChild(resumon)
                } else {
                    let cell1 = document.createElement('th')
                    cell1.colSpan = 1
                    cell1.innerHTML = diaKey[i11] + "-" + dados3[idmuni][diaKey[i11]].dia_semana
                    linha1.appendChild(cell1)
                    let resumo = document.createElement('td')
                    let divgn = document.createElement('div')
                    let icon = document.createElement('img')
                    icon.width = "50"
                    icon.height = "50"
                    let r1n = document.createElement('p')
                    let tmax = document.createElement('p')
                    let tmin = document.createElement('p')
                    resumo.rowSpan = 2
                    //console.log(i11, diaKey[i11], dados3[idmuni][diaKey[i11]]['tarde'], typeof (dados3[idmuni][diaKey[i11]]['manha']))
                    icon.src = dados3[idmuni][diaKey[i11]].icone
                    r1n.innerText = dados3[idmuni][diaKey[i11]].resumo
                    tmax.innerText = 'Max: ' + dados3[idmuni][diaKey[i11]].temp_max + ', ' + dados3[idmuni][diaKey[i11]].temp_max_tende
                    tmin.innerText = 'Min: ' + dados3[idmuni][diaKey[i11]].temp_min + ', ' + dados3[idmuni][diaKey[i11]].temp_min_tende
                    divgn.appendChild(icon)
                    divgn.appendChild(r1n)
                    divgn.appendChild(tmax)
                    divgn.appendChild(tmin)
                    resumo.appendChild(divgn)
                    linha2.appendChild(resumo)
                }
            }
            tt.appendChild(linha1)
            tt.appendChild(linha2)
            tt.appendChild(linha3)
        })
    })
}



