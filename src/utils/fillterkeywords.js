function FillterKeyWords(value, arr){
    let newarr = [];
    arr.forEach(element => {
      if (element.title.indexOf(value) > -1) {
        newarr.push(element);
      } else {
        if (element.children && element.children.length > 0) {
          const ab = FillterKeyWords(value, element.children);
          const obj = {
            ...element,
            children: ab
          };
          if (ab && ab.length>0) {
            newarr.push(obj);
          }
        }
      }
    });
    return newarr;
};
export { FillterKeyWords };