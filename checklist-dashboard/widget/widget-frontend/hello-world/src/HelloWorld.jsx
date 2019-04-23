import React, { Component, Children, version } from 'react';

import { MuiThemeProvider, withStyles} from '@material-ui/core/styles';

import { FormControl, InputLabel, Select, MenuItem, FilledInput, Tooltip, createMuiTheme } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import appendQuery from 'append-query';
import axios from 'axios';

const hostUrl = "https://" + window.location.host + window.contextPath + "/apis/checklist";


const styles = theme => ({
    root: {
        paddingBottom : '70px'
    }    
});

const PageWrapper_style = {
    padding : '30px',
    background : 'transparent',
    boxShadow : 'none'
};

const SelectDiv_style = {
    overflowX: "auto",
    padding : '20px'
};

const FormControl_style = {
    width : '47%',
    display : 'flex',
    wrap : 'nowrap',
    float : 'Left',
    margin : '10px'
};

const TableDiv_style = {
    overflowX: "auto",
};

const TableHeadCell_style = {
    border : '1px solid rgba(0, 0, 0, 0.1)',
    padding : '5px 7px',
    borderRadius : '3px',
    fontSize : '14px',
    fontWeight : 'normal',
    outline : 'none',
    textAlign : 'center'
};

const TableBorder_style = {
    border: "2px solid #aaa",
    overflow: "auto"
};

class HelloWorld extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selected_ProductName: '',
            productNameList: [],
            selected_ProductVersion: '',
            productVersionList: [],
            dependencySummary : '',
            codeCoverage : '',
            gitIssues : '',
            mergedPRCount : '',
        };

        this.handleChange_ProductName = event => {
            this.setState ({ [event.target.name] : event.target.value });
            this.setState({
                selected_ProductName : event.target.value
            }, function () {
                console.log("The selected product name is : " + this.state.selected_ProductName);
            });   
        };

        this.handleChange_ProductVersion = event => {
            this.setState ({ [event.target.name] : event.target.value });
        }
    }

    componentDidMount() {
        const getProductNamesURL = hostUrl + '/products';
       
        axios.create({
            withCredentials:false,
        })
        .get(getProductNamesURL)
        .then(
            res => {
                var response = res.data;
                console.log(response);

                let productsFromApi = response.products.map(products => {
                    return {productName : products}
                });

                this.setState({productNameList : productsFromApi }, function () {
                    console.log(this.state.productNameList)
                });
            })
        .catch(error => {
            console.log(error)
        });           
         
    } //End of componentDidMount

    componentDidUpdate(prevProps, prevState) {
        if(this.state.selected_ProductName !== prevState.selected_ProductName) {
            console.log("Product Name has changed")            
            let versionURL = hostUrl + '/versions/' + this.state.selected_ProductName;
            axios.create({
                withCredentials : false,
            })
            .get(versionURL)
            .then( 
                res => {
                    var response = res.data;
                    console.log(response);

                    let versionsFromApi = response.versions.map(
                        versions => {
                            return { versionTitle : versions.title, versionNumber : versions.number }
                        }
                    );

                    this.setState({productVersionList : versionsFromApi.map(
                        versionsFromApi => ({
                            versionTitle : versionsFromApi.versionTitle,
                            versionNumber : versionsFromApi.versionNumber
                        }))
                    }, function () {
                        console.log(this.state.productVersionList);
                    })
                }

            )
            .catch(error => {
                console.log(error);
            });
        }

        if(this.state.selected_ProductVersion !== prevState.selected_ProductVersion) {
            console.log("Product version has changed");
            let info = { version : this.state.selected_ProductVersion }
    
            let dependencyURL = hostUrl + '/dependency/' + this.state.selected_ProductName;

            let codeCoverageURL = hostUrl + '/codeCoverage/' + this.state.selected_ProductName;

            let gitIssuesURL = hostUrl + '/gitIssues/' + this.state.selected_ProductName;
            gitIssuesURL = appendQuery(gitIssuesURL, info);
            
            let mergedPRCountURL = hostUrl + '/mprCount/' + this.state.selected_ProductName;    
            mergedPRCountURL = appendQuery(mergedPRCountURL, info);
            

            //Dependency Summary
            axios.create({
                withCredentials : false,
            })
            .get(dependencyURL)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ dependencySummary : response }, 
                        function() {
                            console.log(this.state.dependencySummary);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Code coverage
            axios.create({
                withCredentials : false,
            })
            .get(codeCoverageURL)
            .then(
                res => {
                    var response = res.data;
                    this.setState({codeCoverage : response },
                        function() {
                            console.log(this.state.codeCoverage);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            
            //Git issues 
            axios.create({
                withCredentials : false,
            })
            .get(gitIssuesURL)
            .then(
                res => {
                    var response = res.data;
                    this.setState( { gitIssues : response },
                        function() {
                            console.log(this.state.gitIssues);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            axios.create({
                withCredentials : false,
            })
            .get(mergedPRCountURL)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ mergedPRCount : response },
                        function() {
                            console.log(this.state.mergedPRCount);    
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

        }

    }

    render() {
        let reactTheme = createMuiTheme({
            palette : {
                type : this.props.muiTheme.name,
            },
            typography : {
                useNextVariants : true,
            },
        });


        return (
            <MuiThemeProvider theme = {reactTheme}>
                <div style = {PageWrapper_style}>

                    {/* Heading Div */}
                    <div>
                        <h2><center> Release Readiness Metrics </center></h2>
                    </div>

                    {/* Select Div */}
                    <div style = {SelectDiv_style}>
                        {/* Product Name Select */}
                        <FormControl style = {FormControl_style}>
                            <InputLabel htmlFor = "product-name"> Product Name</InputLabel>
                            <Select
                                value = { this.state.selected_ProductName }
                                onChange = { this.handleChange_ProductName }
                                inputProps = {{ 
                                    name : 'selected_ProductName',
                                    id : 'product-name' 
                                }}
                            >
                                {this.state.productNameList.map(
                                    (product) => <MenuItem value = {product.productName}> {product.productName} </MenuItem> 
                                )}
            
                            </Select>
                        </FormControl>

                        {/* Product Version Select */}
                        <FormControl style = {FormControl_style}>
                            <InputLabel htmlFor = "product-version"> Product Version </InputLabel>
                            <Select
                                value = { this.state.selected_ProductVersion }
                                onChange = { this.handleChange_ProductVersion }
                                inputProps = {{
                                    name : 'selected_ProductVersion',
                                    id : 'product-version'
                                }}
                            >
                                {this.state.productVersionList.map(
                                    (version) => <MenuItem value = {version.versionNumber}> {version.versionTitle} </MenuItem>
                                )}

                            </Select>
                        </FormControl>
                    </div>

                    {/* Table Div */}
                    <div style = {TableDiv_style}>
                        <Table style = {TableBorder_style}>
                            <colgroup>
                                <col style={{width: '10%'}}/>
                                <col style={{width: '60%'}}/>
                                <col style={{width: '30%'}}/>
                            </colgroup>
                        
                            <TableHead>
                                <TableCell> <h3> Status </h3> </TableCell>
                                <TableCell align = "center"> <h3> Metrics </h3> </TableCell>
                                <TableCell> <h3> Progress </h3> </TableCell>
                            </TableHead>
                        
                            <TableBody>
                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the security scan results" placement = "top">
                                            <p>Security Scan Reports</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 3 open </a>/ 4 Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> RED </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the Analysis Report results" placement = "top">
                                            <p>Performance Analysis Report</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 6 open </a>/ 10 Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the Customer Commitments" placement = "top">
                                            <p>Customer Commitments</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 3 open </a>/ 4 Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by customers" 
                                            placement = "top">
                                            <p>Security issues by customers</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 3 open </a>/ 4 Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by external security researchers and OSS users" 
                                            placement = "top">
                                            <p>Security issues by external testing</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 3 open </a>/ 4 Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by internal security testing" 
                                            placement = "top">
                                            <p>Security issues by internal testing</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 3 open </a>/ 4 Total
                                    </TableCell>
                                </TableRow>


                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                            <p> <b>L1 Issues</b> </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link"> { this.state.gitIssues.L1Issues } </a> 
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                            <p> <b>L2 Issues</b> </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link"> { this.state.gitIssues.L2Issues } </a>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                            <p> <b>L3 Issues</b> </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link"> { this.state.gitIssues.L3Issues } </a>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <p><b>Code coverage</b></p>
                                    </TableCell>
                                    <TableCell>
                                        <ul>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.instructionCov }</a>
                                                 % : Instruction coverage
                                            </li>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.complexityCov }</a>
                                                % : Complexity coverage
                                            </li>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.lineCov }</a>
                                                % : Line coverage
                                            </li>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.methodCov }</a>
                                                % : Method coverage
                                            </li>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.classCov }</a>
                                                % : Class coverage 
                                            </li>

                                        </ul>
                                        
                                    
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                            <p><b>Merged PRs with pending Doc tasks</b></p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link">{ this.state.mergedPRCount.mprCount }</a> 
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> RED </b> </TableCell>
                                    <TableCell align = "center">
                                            <p><b>Dependancies where the next version available is smaller than a patch</b></p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link">{ this.state.dependencySummary.dependencySummary }</a> 
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}
 
global.dashboard.registerWidget('HelloWorld', withStyles(styles, {withTheme: true})(HelloWorld));