# dataTable
## Installation

Use the package manager npm to install.

```node
npm install
```
## Start Dev server
```node
npm start
```

## Prod Build
```node
npm run build
```


## Usage

```javascript 
import React, { PureComponent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
const getUserTableConfig = (onView) => ([
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'User Name' },
    {
        key: 'actions', label: 'Actions', render: row => (
        <Button onClick={onView.bind(this, row)}>View</Button>)
    },
]);

class UserTable extends PureComponent {
    onView = (user)=>{
        this.props.history.push(`/userDetails/${user.id}`); // use whatever action you want to perform 
    }
    render() {
        return <DataTable columnConfig={getUserTableConfig(this.onView)} sizes={[2, 5, 10]} showDelete showPagination dataUrl='https://jsonplaceholder.typicode.com/users' />
    }
}

```


Limitations

  - Only supports flat object on rowRender
  - No cache on api request will add in next version

