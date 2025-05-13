/* --------------------------------/
Script set up bookmarks on markdown headings H2(##), 
then trying to fing all links to this headings and replacing links to bookmarks
/*--------------------------------*/

function processMDLinks() {
  const doc = DocumentApp.getActiveDocument();
  console.log('opened document '+doc.getName());
  const body = doc.getBody();
  console.log('removing all bookmarks');
  const bms = doc.getBookmarks();
  bms.forEach(bookmark => bookmark.remove());
  
  console.log('searching for headings...');
  let searchResult = null;
  let headings = [];
  while(searchResult = body.findElement(DocumentApp.ElementType.PARAGRAPH, searchResult)) {
    let entry  = searchResult.getElement().asParagraph();
    if (entry.getHeading()==DocumentApp.ParagraphHeading.HEADING2) {
      let pos = doc.newPosition(entry, 0);
      let bookmark = doc.addBookmark(pos);
      headings.push({
        text: '#'+entry.getText().replace(/ /g, '-').replace(/[\(\)]/g, '').toLowerCase(),
        id: bookmark.getId()
      });
    }
  }
  console.log('found headings: '+headings.length);
  //console.log(headings);
  console.log('processing links');
  searchResult = null;
  let i=0;
  while(searchResult = body.findElement(DocumentApp.ElementType.TEXT, searchResult)) {
    let entry  = searchResult.getElement().asText();
    let inUrl = false;
    let c_url = null;
    let s_offset = 0;
    let e_offset = 0;
    for(let ch=0; ch<entry.getText().length; ch++) {
      let url = entry.getLinkUrl(ch);
      if(url != null) {
        if(!inUrl) {
          c_url = url;
          inUrl = true;
          s_offset = ch;
        } else {
          e_offset = ch;
        }
      } 
      if(inUrl && ( url==null || ch==entry.getText().length-1 )) {
        inUrl = false;
        let msg = 'found link '+entry.getText()+' --- '+c_url+'---s:'+s_offset+' e:'+e_offset;
        let h = headings.findIndex(e=>e.text==c_url);
        if(h!=-1) {
          msg+=' --- setting up link ' + '?tab=t.0#bookmark='+headings[h].id;
          entry.setLinkUrl(s_offset, e_offset, '?tab=t.0#bookmark='+headings[h].id);
          i++;
        }
        console.log(msg);
      }  
    }
  }
  console.log('edited links '+i);
}
