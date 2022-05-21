fetch('./assets/mocks/blockchains.json')
  .then(response => response.json())
  .then(data => {
    const listRef = document.querySelector('#blockchains-list');
    const btnRef = document.querySelector('#apply-btn');

    btnRef.addEventListener('click', (e) => {
      const wallet = document.querySelector('input').value;
      const chain = listRef.value;
      const url = `https://deep-index.moralis.io/api/v2/${wallet}/nft?chain=${chain}&format=decimal`;
      fetchNfts(url,chain);
    });

    const blockchains = data;
    
    let listElements = '';

    blockchains.forEach(b => {
        listElements += `<option value="${b.chainId}">${b.currentSymbol}</option>`;
    });

    listRef.innerHTML = listElements;
  });

  function fetchNfts(url,chain) {
    const API_KEY = 'XUnDBl1fLvCROuwpgxpB645C1VrrjGGwfUDz6NmdJNo97qUCftf3a8TU0DGIu6Yo';
    const options = {
      method: 'GET',
      headers: new Headers({ 'X-API-Key': API_KEY }),
    };

    fetch('./assets/mocks/blockchains.json')
    .then(response => response.json())
    .then(data => {
      let blockExplorerURL= "";
      for(let row in data)
      {
        if(chain.includes(data[row].chainId))
        {
          
          blockExplorerURL=data[row].blockExplorerUrl;
        }
      }
      fetch(url, options).then(response => response.json())
      .then(data => {
        const ulRef = document.querySelector('#nfts-list');
        const ulItemRef = document.querySelector('#countItem');

        const nfts = data.result;
        const nftCount= nfts.length;
        let subListElements='';
        ulRef.innerHTML = subListElements;
        ulItemRef.innerHTML=  ` <div class="col-md-4"><h2><p>Total items:${" "} ${nftCount}</p></h2></div>`;
        console.log(nfts.length);
        nfts.forEach((nft) => {
          const metadata = JSON.parse(nft.metadata);
          if (!metadata) return;
          let elem = `
            <div class="col-md-4" style="min-height: 600px;">
              <h1 class="truncated">
                <span title="${nft.token_id}">${nft.token_id}</span>
              </h1>
              <h2 class="truncated">
                <span title="${nft.token_address}"><a href=${blockExplorerURL + nft.token_address} target="_blank">${nft.token_address}</a></span>
              </h2>
              <img style="max-width: 100%;" src="${metadata.image}" />
            `;
          let trait="";
          Object.keys(metadata).map(key => {

              if(key=="traits" || key=="attributes")
              {       
                for(let row in metadata[key])
                {
                  for(let secondRow in metadata[key][row])
                  {
                    trait += `
                    <p style="margin: 0;" >
                      <span title="${secondRow}"> <b>${secondRow} </b>: ${metadata[key][row][secondRow]}</span>
                      </br>
                    </p>`;
                  }
                }
              }

                elem += `
                <p style="margin: 0;" >
                  <span title="${metadata[key]}"> <b>${key} 
                  </b>: ${key =="traits" || key =="attributes" ? "": key=="image"?`<a href=${metadata[key]} target="_blank">image</a>`:metadata[key]}               
                  </span>
                  </br>
                </p>
                ${trait}
                `
                ;
              }
            
            );

            subListElements += elem + '</div>'
        });

        ulRef.innerHTML = subListElements;
      })

    });


  }