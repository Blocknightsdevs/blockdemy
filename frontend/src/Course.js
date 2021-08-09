
function Course() {

    return (
     <form enctype="multipart/form-data">
        Title: <input type="text" name="title"></input>
        Description: <input type="text" name="description"></input>
        Price: <input type="number" name="price"></input>
        OnSale: <input type="checkbox"/> 
        File: <input type="file" name="file" multiple id="file"/>
        <input type="submit" name="ok"  />
     </form>
    );
  }
  
  export default Course;
  