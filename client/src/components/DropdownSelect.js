import React from "react";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography'; 
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    menuPaper: {
        maxHeight: 200,
      },
    
    text: {
        fontSize: 14,
      }
}))

function DropdownSelect({defaultValue,handler,options}) {

    const classes = useStyles();

    return (       
            <TextField
                select 
                SelectProps={{ 
                    MenuProps: {classes: { paper: classes.menuPaper}}  
                }}
                variant="outlined"
                value={defaultValue}
                type="text"
                onChange={handler}
                fullWidth={true}
                color="secondary"
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <Typography variant="subtitle2" className={classes.text}>{option.label}</Typography>
                    </MenuItem>
                ))}
            </TextField>
    )
}

export default DropdownSelect