import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from '../actions/action_index';
// import '../../css/styles.css';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import axios from "axios";
import EmployeeDialogs from "./EmployeeDialogs";
import CustomizedDialogs from "./CustomizedDialogs";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

const { SearchBar, ClearSearchButton } = Search;

function mapStateToProps(state) {
    return {
        //employee: state.contacts,
        contacts: state.contacts,
    };
};

function addLinkFormatter(cell, row) {
    console.log(cell, row)
    return (
        <section>
            <Link to={`/show/${row.id}`}>
                <img className="contact-icon" src={`/file/${row.id}`} alt="" /> {cell}
            </Link>
        </section>
    )
}

class ConnectedList1 extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            contacts: props.contacts
        };
        this.addLinkFormatterForButton = this.addLinkFormatterForButton.bind(this)
    }

    componentDidMount() {
        axios.get("http://localhost:8081/employee").then(response => {
            this.props.loadContacts({
                contacts: response.data
            })
        })
    }

    addLinkFormatterForButton(cell, row) {
        console.log(cell, row)
        return (
            <section>
                <CustomizedDialogs employeeId={row.id} contact={row} refreshEmployee={this.props.refreshEmployee} type={"employee"}/>

            </section>
        )
    }


    render() {
        const columns = [{
            dataField: 'employeeId',
            text: 'Employee Id',
            sort: true,
        },{
            dataField: 'firstName',
            text: 'Employee Name',
            formatter: (value, contacts) => {
                return value + ' ' + contacts.lastName
            },
            sort: true,
        }, {
            dataField: 'department',
            text: 'Department',
            sort: true,
        },
            {
                dataField: '_id',
                text: 'Action',
                formatter: this.addLinkFormatterForButton
            }
        ];

        const defaultSorted = [{
            dataField: 'employeeId',
            order: 'asc'
        }];

        return (

            <ToolkitProvider
                keyField="employeeId"
                data={ this.props.contacts }
                columns={ columns }
                search
            >
                {
                    props => (
                        <div>
                            <hr />
                            <SearchBar { ...props.searchProps } />
                            <ClearSearchButton { ...props.searchProps } />
                            <hr />
                            <BootstrapTable
                                { ...props.baseProps }
                                bordered={false}
                                inverse
                                hover
                                condensed
                                striped
                                responsive
                                pagination={ paginationFactory() }
                                defaultSorted={ defaultSorted }
                                headerClasses="header-class"
                            />
                        </div>
                    )
                }
            </ToolkitProvider>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
}
const EmployeeList = connect(mapStateToProps, mapDispatchToProps)(ConnectedList1);
export default EmployeeList;