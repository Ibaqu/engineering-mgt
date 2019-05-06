import React, { Component, Children, version } from 'react';
import { MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import { FormControl, InputLabel, Select, MenuItem, FilledInput, Tooltip, createMuiTheme } from '@material-ui/core';
import Widget from '@wso2-dashboards/widget';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import appendQuery from 'append-query';
const hostUrl = "https://" + window.location.host + window.contextPath + "/apis/checklist";

const styles = theme => ({
    root: {
        paddingBottom : '70px'
    }    
});

const PageWrapper_style = {
    paddingRight : '20px',
    paddingLeft : '20px',
    background : 'transparent',
    boxShadow : 'none'
};

const SelectDiv_style = {
    overflowX: "auto",
    padding : '5px'
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

const TableBorder_style = {
    border: "2px solid #aaa",
    overflow: "auto"
};

const RED = {
    height: '20px',
    width: '20px',
    backgroundColor : '#FF3C33',
    borderRadius: '50%',
    display: 'inline-block'
}

const YELLOW = {
    height: '20px',
    width: '20px',
    backgroundColor: '#FFDD33',
    borderRadius: '50%',
    display: 'inline-block'
}

const GREEN = {
    height: '20px',
    width: '20px',
    backgroundColor: '#79F63B',
    borderRadius: '50%',
    display: 'inline-block'
}

const GREY = {
    height: '20px',
    width: '20px',
    backgroundColor: '#AFAFAF',
    borderRadius: '50%',
    display: 'inline-block'
}

class Checklist extends Widget {
    
    constructor(props) {
        super(props);
        this.state = {
            selected_ProductName: '',
            productNameList: [],
            selected_ProductVersion: '',
            productVersionList: [],

            jiraSecScan : { totalIssues : 0, openIssues : 0, refLink : "" }, 
            jiraSecScanStatus : { status : GREY },

            jiraPerf : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraPerfStatus : { status : GREY },

            jiraCommitment : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraCommitmentStatus : { status : GREY },

            jiraSecCust : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecCustStatus : { status : GREY },

            jiraSecExt : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecExtStatus : { status : GREY },

            jiraSecInt : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecIntStatus : { status : GREY },

            gitIssues : { L1Issues : 0, L2Issues : 0, L3Issues : 0, refLink :"" },
            gitIssueL1Status : { status : GREY },
            gitIssueL2Status : { status : GREY },
            gitIssueL3Status : { status : GREY },

            codeCoverage : { instructionCov : 0, branchCov : 0, complexityCov : 0, 
                lineCov : 0, methodCov : 0, classCov : 0, refLink : ""
            },
            codeCoverageStatus : { status : GREY },

            mergedPRCount : { mprCount : 0, refLink : "" },
            mergedPRCountStatus : { status : GREY },
            
            dependencySummary : { dependencySummary : 0, refLink : ""},
            dependenctSummaryStatus : { status : GREY },
        };

        this.handleChange_ProductName = event => {
            this.setState ({ [event.target.name] : event.target.value });
            this.setState({
                selected_ProductName : event.target.value
            });  
        };

        this.handleChange_ProductVersion = event => {
            this.setState ({ [event.target.name] : event.target.value });
            this.setState ({ 
                selected_ProductVersion : event.target.value
            });
        }
    }

    componentDidMount() {
        const getProductNamesURL = hostUrl + '/products';
        //const getProductNamesURL = "https://www.mocky.io/v2/5cbed162300000b9069ce2d1";
       
        axios.create({
            withCredentials:false,
        })
        .get(getProductNamesURL)
        .then(
            res => {
                var response = res.data;

                let productsFromApi = response.products.map(products => {
                    return {productName : products}
                });

                this.setState({productNameList : productsFromApi }, function () {
                    console.log("Product Name list : ");
                    console.log(this.state.productNameList)
                });
            })
        .catch(error => {
            console.log(error)
        });           
         
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.selected_ProductName !== prevState.selected_ProductName) {
            this.resetState();
           
            let versionURL = hostUrl + '/versions/' + this.state.selected_ProductName;
            //let versionURL = "https://www.mocky.io/v2/5cbed19d300000ba069ce2d3";
            axios.create({
                withCredentials : false,
            })
            .get(versionURL)
            .then( 
                res => {
                    var response = res.data;
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
                        console.log("Product Version list : ");
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
            let infoVersion = { version : this.state.selected_ProductVersion.versionNumber }
            let infoTitle = { version : this.state.selected_ProductVersion.versionTitle }
            
            let gitIssuesURL = hostUrl + '/gitIssues/' + this.state.selected_ProductName;
            //let gitIssuesURL = "https://www.mocky.io/v2/5cc01e0a310000580b036090";
            gitIssuesURL = appendQuery(gitIssuesURL, infoVersion);

            let codeCoverageURL = hostUrl + '/codeCoverage/' + this.state.selected_ProductName;
            //let codeCoverageURL = "https://www.mocky.io/v2/5cc0121a3100009f0a036018";
            
            let mergedPRCountURL = hostUrl + '/mprCount/' + this.state.selected_ProductName;
            //let mergedPRCountURL = "https://www.mocky.io/v2/5cc012933100007e0f036024"    
            mergedPRCountURL = appendQuery(mergedPRCountURL, infoTitle);

            let dependencyURL = hostUrl + '/dependency/' + this.state.selected_ProductName;
            //let dependencyURL = "https://www.mocky.io/v2/5cc011df310000170e036016";

            var jiraTypesArray = ['sec-scan', 'perf-report', 'commitment', 'sec-cust', 'sec-ext', 'sec-int'];
            
            console.log("Displaying all Jira Issue types");

            var jiraTypesArrayLength = jiraTypesArray.length;

            for(var i=0; i < jiraTypesArrayLength; i++) {
                console.log(jiraTypesArray[i]);
                let Query = { 
                    version : this.state.selected_ProductVersion.versionTitle , issueType : jiraTypesArray[i] 
                }
                console.log(Query);

                let jiraURL = hostUrl + '/jiraIssues/' + this.state.selected_ProductName;
                jiraURL = appendQuery(jiraURL, Query);

                console.log(jiraURL);

                switch (jiraTypesArray[i]) {
                    case "perf-report" : {
                        console.log("Security Scan hit");

                        axios.create({
                            withCredentials : false,
                        })
                        .get(jiraURL)
                        .then(
                            res => {
                                this.setState({ jiraSecScan : res.data }, 
                                    function() {
                                        console.log(this.state.jiraSecScan)
                                        if(this.state.jiraSecScan.openIssues > 0) {
                                            this.setState({ jiraSecScanStatus : { status : RED } }); 
                                        } else {
                                            this.setState({ jiraSecScanStatus : { status : GREEN } });
                                        }
                                    }
                                );
                            }
                        ).catch(error => {
                            console.log(error);
                        });
                        break;
                    }

                    case "sec-scan" : {
                        console.log("Performance report hit");

                        axios.create({
                            withCredentials : false,
                        })
                        .get(jiraURL)
                        .then(
                            res => {
                                this.setState({ jiraPerf : res.data }, 
                                    function() {
                                        console.log(this.state.jiraPerf)
                                        if(this.state.jiraPerf.openIssues > 0) {
                                            this.setState({ jiraPerfStatus : { status : RED } });
                                        } else {
                                            this.setState({ jiraPerfStatus : { status : GREEN } });
                                        }
                                    }
                                );
                            }
                        ).catch(error => {
                            console.log(error);
                        });
            

                        break;
                    }

                    case "commitment" : {
                        console.log("Customer commitment hit");

                        axios.create({
                            withCredentials : false,
                        })
                        .get(jiraURL)
                        .then(
                            res => {
                                this.setState({ jiraCommitment : res.data }, 
                                    function() {
                                        console.log(this.state.jiraCommitment);
                                        if(this.state.jiraCommitment.openIssues > 0) {
                                            this.setState({ jiraCommitmentStatus : { status : RED }});
                                        } else {
                                            this.setState({ jiraCommitmentStatus : { status : GREEN }})
                                        }
                                    }
                                );
                            }
                        ).catch(error => {
                            console.log(error);
                        });

                        break;
                    }

                    case "sec-cust" : {
                        console.log("Security Issues by customers hit");

                        axios.create({
                            withCredentials : false,
                        })
                        .get(jiraURL)
                        .then(
                            res => {
                                this.setState({ jiraSecCust : res.data }, 
                                    function() {
                                        if(this.state.jiraSecCust.openIssues > 0) {
                                            this.setState( { jiraSecCustStatus : { status : RED }});
                                        } else {
                                            this.setState( { jiraSecCustStatus : { status : GREEN }});
                                        }
                                    }
                                );
                            }
                        ).catch(error => {
                            console.log(error);
                        });
            
                        break;
                    }

                    case "sec-ext" : {
                        console.log("Security issues by external testing hit");

                        axios.create({
                            withCredentials : false,
                        })
                        .get(jiraURL)
                        .then(
                            res => {
                                this.setState({ jiraSecExt : res.data}, 
                                    function() {
                                        if(this.state.jiraSecExt.openIssues > 0) {
                                            this.setState( { jiraSecExtStatus : { status : RED }});
                                        } else {
                                            this.setState( { jiraSecExtStatus : { status : GREEN }});
                                        }
                                    }
                                );
                            }
                        ).catch(error => {
                            console.log(error);
                        });
                        break;
                    }

                    case "sec-int" : {
                        console.log("Security issues by internal testing hit");

                        axios.create({
                            withCredentials : false,
                        })
                        .get(jiraURL)
                        .then(
                            res => {
                                this.setState({ jiraSecInt : res.data}, 
                                    function() {
                                        if(this.state.jiraSecInt.openIssues > 0) {
                                            this.setState( { jiraSecIntStatus : { status : RED }});
                                        } else {
                                            this.setState( { jiraSecIntStatus : { status : GREEN }});
                                        }
                                    }
                                );
                            }
                        ).catch(error => {
                            console.log(error);
                        });
                        break;
                    }

                }

            }
      
            //Git issues 
            axios.create({
                withCredentials : false,
            })
            .get(gitIssuesURL)
            .then(
                res => {
                    this.setState( { gitIssues : res.data},
                        function() {
                            if(this.state.gitIssues.L1Issues > 0) {
                                this.setState( { gitIssueL1Status : { status : RED }});
                            } else {
                                this.setState( { gitIssueL1Status : { status : GREEN }});
                            }

                            if(this.state.gitIssues.L2Issues > 0 && this.state.gitIssues.L2Issues <= 5) {
                                this.setState( { gitIssueL2Status : { status : YELLOW }});
                            } else if(this.state.gitIssues.L2Issues > 5) {
                                this.setState( { gitIssueL2Status : { status : RED }});
                            } else {
                                this.setState( { gitIssueL2Status : { status : GREEN }});
                            }

                            if(this.state.gitIssues.L3Issues > 50) {
                                this.setState( { gitIssueL3Status : { status : YELLOW }});
                            } else {
                                this.setState( { gitIssueL3Status : { status : GREEN }})
                            }
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
                    this.setState({codeCoverage : res.data },
                        function() {
                            if(this.state.codeCoverage.lineCov < 40 ) {
                                this.setState( { codeCoverageStatus : { status : RED }});
                            } else if((this.state.codeCoverage.lineCov > 40) && (this.state.codeCoverage.lineCov < 70)){
                                this.setState( { codeCoverageStatus : { status : YELLOW }});
                            } else {
                                this.setState( { codeCoverageStatus : { status : GREEN }});
                            }
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Merged PR Count
            axios.create({
                withCredentials : false,
            })
            .get(mergedPRCountURL)
            .then(
                res => {
                    this.setState({ mergedPRCount : res.data },
                        function() {
                            if(this.state.mergedPRCount.mprCount > 20) {
                                this.setState( { mergedPRCountStatus : { status : RED }});
                            } else {
                                this.setState( { mergedPRCountStatus : { status : GREEN }});
                            }
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Dependency Summary
            axios.create({
                withCredentials : false,
            })
            .get(dependencyURL)
            .then(
                res => {
                    this.setState({ dependencySummary : res.data }, 
                        function() {
                            if(this.state.dependencySummary.dependencySummary < 10 ) {
                                this.setState( { dependenctSummaryStatus : { status : GREEN }});
                            } else {
                                this.setState( { dependenctSummaryStatus : { status : RED }});
                            }
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

        }

    }

    resetState() {
        this.setState({ 
            jiraSecScan : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecScanStatus : { status : GREY },

            jiraPerf : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraPerfStatus : { status : GREY },

            jiraCommitment : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraCommitmentStatus : { status : GREY },

            jiraSecCust : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecCustStatus : { status : GREY },

            jiraSecExt : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecExtStatus : { status : GREY },

            jiraSecInt : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecIntStatus : { status : GREY },

            gitIssues : { L1Issues : 0, L2Issues : 0, L3Issues : 0, refLink :"" },
            gitIssueL1Status : { status : GREY },
            gitIssueL2Status : { status : GREY },
            gitIssueL3Status : { status : GREY },

            codeCoverage : { instructionCov : 0, branchCov : 0, complexityCov : 0, 
                lineCov : 0, methodCov : 0, classCov : 0, refLink : ""
            },
            codeCoverageStatus : { status : GREY },

            mergedPRCount : { mprCount : 0, refLink : "" },
            mergedPRCountStatus : { status : GREY },

            dependencySummary : { dependencySummary : 0, refLink : ""},
            dependenctSummaryStatus : { status : GREY },
        })
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
                                    (version) => <MenuItem value = {version}> {version.versionTitle} </MenuItem>
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
                                <TableCell style = {{ color : '#33b5e5'}}> <h3> Status </h3> </TableCell>
                                <TableCell style = {{ color : '#33b5e5'}} align = "center"> 
                                    <h3> Metrics </h3> 
                                </TableCell>
                                <TableCell style = {{ color : '#33b5e5'}}> <h3> Progress </h3> </TableCell>
                            </TableHead>
                        
                            <TableBody>
                                
                                { /* JIRA : Security Scan */ }
                                <TableRow>
                                    <TableCell>
                                        <span style = {this.state.jiraSecScanStatus.status}></span> 
                                    </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the security scan results" placement = "top">
                                            <p>Security Scan Reports</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = {this.state.jiraSecScan.refLink} target="_blank"> 
                                            {this.state.jiraSecScan.openIssues } open 
                                        </a> / {this.state.jiraSecScan.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                { /* JIRA : Performance Analysis */ }
                                <TableRow>
                                    <TableCell>
                                        <span style = {this.state.jiraPerfStatus.status}></span>
                                    </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the Performance Analysis Report results" placement = "top">
                                            <p>Performance Analysis Report</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = {this.state.jiraPerf.refLink} target="_blank"> 
                                            {this.state.jiraPerf.openIssues } open 
                                        </a> / {this.state.jiraPerf.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                { /* JIRA : Commitment */ }
                                <TableRow>
                                    <TableCell> 
                                        <span style = {this.state.jiraCommitmentStatus.status}></span>
                                    </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the Customer Commitments" placement = "top">
                                            <p>Customer Commitments</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = {this.state.jiraCommitment.refLink} target="_blank"> 
                                            {this.state.jiraCommitment.openIssues } open 
                                        </a> / {this.state.jiraCommitment.totalIssues } Total
                                        
                                    </TableCell>
                                </TableRow>

                                { /* JIRA : Security Customer */ }
                                <TableRow>
                                    <TableCell> 
                                        <span style = {this.state.jiraSecCustStatus.status}> </span> 
                                    </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by customers" 
                                            placement = "top">
                                            <p>Security issues by customers</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = {this.state.jiraSecCust.refLink} target="_blank"> 
                                            {this.state.jiraSecCust.openIssues } open 
                                        </a> / {this.state.jiraSecCust.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                { /* JIRA : Security External */ }
                                <TableRow>
                                    <TableCell> 
                                        <span style = {this.state.jiraSecExtStatus.status}></span>
                                    </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by external security researchers and OSS users" 
                                            placement = "top">
                                            <p>Security issues by external testing</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = {this.state.jiraSecExt.refLink} target="_blank"> 
                                            {this.state.jiraSecExt.openIssues } open 
                                        </a> / {this.state.jiraSecExt.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                { /* JIRA : Security Internal */ }
                                <TableRow>
                                    <TableCell> 
                                        <span style = {this.state.jiraSecIntStatus.status}></span>
                                    </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by internal security testing" 
                                            placement = "top">
                                            <p>Security issues by internal testing</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell> 
                                        <a href = {this.state.jiraSecInt.refLink} target="_blank"> 
                                            {this.state.jiraSecInt.openIssues } open 
                                        </a> / {this.state.jiraSecInt.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                { /* Git Issue : L1 */ }
                                <TableRow>
                                    <TableCell>
                                        <span style = {this.state.gitIssueL1Status.status}></span>
                                    </TableCell>
                                    <TableCell align = "center">
                                            <p> L1 Issues </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = { this.state.gitIssues.refLink } target="_blank"> 
                                            { this.state.gitIssues.L1Issues }
                                        </a> 
                                    </TableCell>
                                </TableRow>

                                { /* Git Issue : L2 */ }
                                <TableRow>
                                    <TableCell> 
                                        <span style = {this.state.gitIssueL2Status.status}></span>
                                    </TableCell>
                                    <TableCell align = "center">
                                            <p> L2 Issues </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = { this.state.gitIssues.refLink } target="_blank"> 
                                            { this.state.gitIssues.L2Issues } 
                                        </a>
                                    </TableCell>
                                </TableRow>

                                { /* Git Issue : L3 */ }
                                <TableRow>
                                    <TableCell> 
                                        <span style = {this.state.gitIssueL3Status.status}></span>
                                    </TableCell>
                                    <TableCell align = "center">
                                            <p> L3 Issues </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = { this.state.gitIssues.refLink } target="_blank"> 
                                            { this.state.gitIssues.L3Issues }
                                        </a>
                                    </TableCell>
                                </TableRow>

                                { /* Code Coverage */}
                                <TableRow>
                                    <TableCell>
                                        <span style = {this.state.codeCoverageStatus.status}></span>    
                                    </TableCell>
                                    <TableCell align = "center">
                                        <p>Code coverage</p>
                                    </TableCell>
                                    <TableCell>
                                        <ul>
                                            <li>
                                                <a href = { this.state.codeCoverage.refLink } target="_blank">
                                                    { this.state.codeCoverage.instructionCov }
                                                </a> % : Instruction coverage
                                            </li>
                                            <li>
                                                <a href = { this.state.codeCoverage.refLink } target="_blank">
                                                    { this.state.codeCoverage.complexityCov }
                                                </a> % : Complexity coverage
                                            </li>
                                            <li>
                                                <a href = { this.state.codeCoverage.refLink } target="_blank" >
                                                    { this.state.codeCoverage.lineCov }
                                                </a> % : Line coverage
                                            </li>
                                            <li>
                                                <a href = { this.state.codeCoverage.refLink } target="_blank" >
                                                    { this.state.codeCoverage.methodCov }
                                                </a> % : Method coverage
                                            </li>
                                            <li>
                                                <a href = { this.state.codeCoverage.refLink } target="_blank">
                                                    { this.state.codeCoverage.classCov }
                                                </a> % : Class coverage 
                                            </li>
                                        </ul>
                                    </TableCell>
                                </TableRow>

                                { /* Merged PR count Status */}
                                <TableRow>
                                    <TableCell> 
                                        <span style = {this.state.mergedPRCountStatus.status}></span>
                                    </TableCell>
                                    <TableCell align = "center">
                                            <p>Merged PRs with pending Doc tasks</p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = { this.state.mergedPRCount.refLink } target="_blank">
                                            { this.state.mergedPRCount.mprCount }
                                        </a> 
                                    </TableCell>
                                </TableRow>

                                { /* Dependency Summary */}
                                <TableRow>
                                    <TableCell> 
                                        <span style = {this.state.dependenctSummaryStatus.status}></span> 
                                    </TableCell>
                                    <TableCell align = "center">
                                            <p>Dependancies where the next version available is smaller than a patch</p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = { this.state.dependencySummary.refLink } target="_blank">
                                            { this.state.dependencySummary.dependencySummary }
                                        </a> 
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
 
global.dashboard.registerWidget('Checklist', withStyles(styles, {withTheme: true})(Checklist));