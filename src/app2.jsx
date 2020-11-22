import React, { PureComponent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Spinner, Pagination } from 'react-bootstrap';
// import DataTable  from './components/DataTable';
// import DataTable from './component/DataGrid';
// import DataGrid from './DataTable';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    Redirect,
    withRouter
  } from "react-router-dom";

const getUserTableConfig = (onView) => ([
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'User Name' },
    {
        key: 'actions', label: 'Actions', render: row => (
        <Button onClick={onView.bind(this, row)}>View</Button>)
    },
]);
const getUserDetailTableConfig = () => ([
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'User Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'website', label: 'Website' },
]);


class Page extends PureComponent {
    updatePage = (page) => {
        const pages = this.totalPages
        const size = this.props.size

        if (page > 0 && page <= pages) {
            this.props.onChange({ size, page })
        }
    }

    get totalPages() {
        return Math.ceil(this.props.total / this.props.size)
    }

    handlePageChange = (e) => {
        this.updatePage(parseInt(e.target.value, 10))
    }

    handleSizeChange = (e) => {
        // TODO: Should we keep user on current page?
        this.props.onChange({ size: parseInt(e.target.value, 10), page: 1 })
    }
    render() {
        const { total, size, page, className, sizes, hideSize } = this.props
        const totalPages = Math.ceil(total / size)
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => page)
        const start = (page - 1) * size + 1
        const end = total < start + size - 1 ? total : start + size - 1
        return (
            <div className='paginationContainer'>
                <div>
                    <span>Rows per page:</span>
                    <div>
                        <select value={size} onChange={this.handleSizeChange}>
                            {sizes.map((item) => {
                                return (
                                    <option value={item} key={item}>
                                        {item}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div>
                        <strong>{start} to {end}</strong>{' '} of {total}
                    </div>
                </div>
                <div className='paginator'>
                    <div role="button" onClick={() => this.updatePage(page - 1)}>{'<'}</div>
                    <select value={page} onChange={this.handlePageChange}>
                        {pages.map((pageList) => {
                            return (
                                <option value={pageList} key={pageList}>
                                    {pageList}
                                </option>
                            )
                        })}
                    </select>
                    <div role="button" onClick={() => this.updatePage(page + 1)}>{'>'}</div>
                </div>
            </div>)
    }
}



class DataTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            size: props.pageSize || 2,
            data: [],
            totalCount: 10,
            isLoading: false,
            error: "",
            noData: false
        };
    }
    populateData = params => {
        this.setState({
            data: [],
            isLoading: true,
            noData: false,
            error: ""
        }, this.fetchData());

    };
    fetchData = () => {
        const query = {
            _start: (this.state.page - 1) * this.state.size,
            _limit: this.state.size,
        };
        fetch(`${this.props.dataUrl}?` + new URLSearchParams(query)).then(res => res.json())
            .then(data => {
                if (data && data.length) {
                    this.setState({
                        data: [...data],
                        isLoading: false,
                        noData: false,
                    });
                } else if(typeof data === 'object' && data !== null){
                    this.setState({
                        data: [].concat(data),
                        isLoading: false,
                        noData: false,
                    });
                }else {
                    this.setState({
                        data: [],
                        isLoading: false,
                        noData: true,
                        error: "No Data",
                    });
                }
            })
            .catch(e => {
                const { status, message } = e;
                this.setState({
                    data: [],
                    isLoading: false,
                    noData: true,
                    error: status ? status.statusMessage || message : "Something went wrong"
                });
            });
    }
    componentDidMount = () => {
        this.populateData({});
    };
    onDelete = (id)=>{
        this.setState({data: this.state.data.filter(r=>{
            if(r.id===id){
                return false
            }
            return true
        })})
    }
    onPageChange = ({ page, size }) => {
        this.setState({ page, size }, () => {
            this.populateData();
        });
    };
    renderDeleteButton = (id) =>{
        return <Button onClick={this.onDelete.bind(this,id)}>Delete</Button>
    }
    renderProgress = () => (
        <Spinner animation="grow" />
    );
    renderRow = (columnConfig, row) => {
        const {showDelete} = this.props;
        const configRows = columnConfig.map(header => {
            const { label, render, key } = header
            if (render) {
                return <td>{render(row)}</td>
            }
            return <td>{row[key]}</td>
        })
        if(showDelete){
            configRows.push(<td>{this.renderDeleteButton(row.id)}</td>)
        }
        return <tbody><tr>{configRows}</tr></tbody>
    }
    renderHeader = columnConfig => {
        return <thead><tr>{columnConfig.map(header => <th>{header.label}</th>)}</tr></thead>
    }
    renderTable = () => {
        const { columnConfig } = this.props;
        return <Table>
            {this.renderHeader(columnConfig)}
            {this.state.data.map(row => this.renderRow(columnConfig, row))}
        </Table>
    };
    render() {
        const { isLoading, error, noData } = this.state;
        const {showPagination, sizes} =this.props;
        if (noData || (error && error.length)) {
            return <div className="text error"> {error} </div>;
        }
        if (isLoading) {
            return <div>{this.renderProgress()}</div>;
        }
        return (
            <div>
                {this.renderTable()}
                {showPagination?<div className="DataGridWrapper">
                    <Page
                        page={this.state.page}
                        size={this.state.size}
                        total={this.state.totalCount}
                        onChange={this.onPageChange}
                        sizes={sizes}
                    />
                </div>:null}
            </div>
        );
    }
}




class UserTable extends PureComponent {
    onView = (user)=>{
        this.props.history.push(`/userDetails/${user.id}`);
    }
    render() {
        return <DataTable columnConfig={getUserTableConfig(this.onView)} sizes={[2, 5, 10]} showDelete showPagination dataUrl='https://jsonplaceholder.typicode.com/users' />
    }
}
class UserDetails extends PureComponent{
    render(){
        const {id} = this.props.match.params;
        return <DataTable columnConfig={getUserDetailTableConfig()} sizes={[1]} showPagination={false} dataUrl={`https://jsonplaceholder.typicode.com/users/${id}`} />
    }
}
const UserDetailWithRouter = withRouter(UserDetails)
const UserTableWithRouter = withRouter(UserTable)
export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/">
                                <UserTableWithRouter />
                            </Route>
                            <Route exact path="/userDetails/:id">
                                <UserDetailWithRouter />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </React.Fragment>
        )
    }
}