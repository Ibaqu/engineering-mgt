import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';
import { lighten } from 'material-ui/styles/colorManipulator';
import axios from "axios/index";



const columnData = [
    { id: 'milestoneName', numeric: false, disablePadding: true, label: 'Milestone Name' },
    { id: 'productName', numeric: false, disablePadding: false, label: 'Product' },
    { id: 'ver', numeric: false, disablePadding: false, label: 'Version' },
    { id: 'startDate', numeric: false, disablePadding: false, label: 'Start Date' },
    { id: 'endDate', numeric: false, disablePadding: false, label: 'End Date' },
];


var config = require('./config.json');

const hostUrl = config.url + config.service_path;



class MilestoneTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {columnData.map(column => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                padding={column.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === column.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order}
                                        onClick={this.createSortHandler(column.id)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

MilestoneTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let MilestoneTableToolbar = props => {
    const { numSelected, classes, onDelete } = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subheading">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="title">Milestones</Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete" onClick={onDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

MilestoneTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onDelete:PropTypes.func.isRequired,
};

MilestoneTableToolbar = withStyles(toolbarStyles)(MilestoneTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 800,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class MilestoneTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            order: 'asc',
            orderBy: 'milestoneName',
            selected: [],
            data: this.props.data,
            page: 0,
            rowsPerPage: 5,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        if(orderBy!=='startDate' && orderBy!=='endDate') {
            const data =
                order === 'desc'
                    ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
                    : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

            this.setState({ data, order, orderBy });
        } else {
            const data =
                order === 'desc'
                    ? this.state.data.sort((a, b) => {
                        console.log(a);
                        var dayA = new Date(a[orderBy].time);
                        var dayB = new Date(b[orderBy].time);
                        return dayA > dayB?-1:1;
                    })
                    : this.state.data.sort((a, b) => {
                        var dayA = new Date(a[orderBy].time);
                        var dayB = new Date(b[orderBy].time);
                        return dayA < dayB?-1:1;
                    });

            this.setState({ data, order, orderBy });
        }
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.state.data.map(n => n.milestoneId) });
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    onDelete = event => {
        var selected = this.state.selected;
        var records = [];
        for(var s in selected) {
            records.push({id:selected[s]});
        }
        console.log(records);
        axios.post(hostUrl + '/deletemilestones', {
            records:records,
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }})
            .then(response => {
                console.log(response);
                this.props.loadMilestones();
            })
            .catch(error => {
                console.log(error);
            });

        this.setState({selected:[]});
    };

    render() {
        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data===undefined?0:data.length - page * rowsPerPage);

        if(data!==undefined) {
            return (
                <Paper className={classes.root}>
                    <MilestoneTableToolbar
                        numSelected={selected.length}
                        onDelete={this.onDelete}
                    />
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <MilestoneTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                            />
                            <TableBody>
                                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                                    const isSelected = this.isSelected(n.milestoneId);
                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.handleClick(event, n.milestoneId)}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n.milestoneId}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            <TableCell>{n.milestoneName}</TableCell>
                                            <TableCell>{n.productName}</TableCell>
                                            <TableCell>{n.ver}</TableCell>
                                            <TableCell>{(new Date(n.startDate.time)).toDateString()}</TableCell>
                                            <TableCell>{(new Date(n.endDate.time)).toDateString()}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 49 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        colSpan={6}
                                        count={data.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        backIconButtonProps={{
                                            'aria-label': 'Previous Page',
                                        }}
                                        nextIconButtonProps={{
                                            'aria-label': 'Next Page',
                                        }}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </Paper>
            );
        } else {
            return (<p>No milestones found.</p>)
        }
    }
}

MilestoneTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MilestoneTable);
