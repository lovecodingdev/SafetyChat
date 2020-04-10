import React, { Component } from 'react';
import {
    FlatList,
} from 'react-native';

import {Colors} from '../theme';
import Choice from './Choice'
import Utils from './utils'
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

export default class ManyChoices extends Component {
    constructor(props) {
        super(props);
        var {data, checkedIndexes} = props

        this.state = {
            choiceData: this.getChoiceData(data, checkedIndexes)
        }
    }

    getChoiceData(data, checkedIndexes){

        var choiceData = data.map((text, index) => {
            if(checkedIndexes.includes(index)){
                return {
                    index: index,
                    text: text,
                    checked: true,
                }
            }else{
                return {
                    index: index,
                    text: text,
                    checked: false,
                }                        
            }
        })

        return choiceData
    }

    onItemPressed(choiceIndex){
        var choiceData = Utils.copy(this.state.choiceData)
        var choiceItem = choiceData[choiceIndex]
        if (!this.props.many) {
            for (let index = 0; index < choiceData.length; index++) {
                choiceData[index].checked = false;                
            }
        }
        choiceData[choiceIndex].checked = !choiceItem.checked
        
        this.setState({
            choiceData: choiceData
        })

        //react bug Not render until scroll
        // this.flatList.scrollToOffset({offset: -1})
        // this.flatList.scrollToOffset({offset: 1})

        var checkedIndexes = []
        
        for (const choiceItem of choiceData) {
            if(choiceItem.checked) checkedIndexes.push(choiceItem.index)            
        }

        this.props.onChanged(this.props.questionIndex, checkedIndexes)
    }

    render() {
        var many = this.props.many
        return (
            <FlatList
                ref = {ref=>this.flatList = ref}
                scrollEnabled={true}
                data = {this.state.choiceData}
                renderItem = {({item, index})=>
                    <Choice many={many} {...item} onPress={this.onItemPressed.bind(this)}/>
                }
                keyExtractor = {(item, index) => index.toString()}
                style={{width: '80%', height: responsiveHeight(60), backgroundColor: 'rgba(0,0,0,0)'}}
            />
        )
    }
}

