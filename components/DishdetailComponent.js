import React, { Component } from 'react';
import { Text, View , ScrollView, FlatList,StyleSheet,Modal,Button,PanResponder,Alert, Share } from 'react-native';
import { Card,Icon,Rating,Input} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite,postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }


  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
})

class RenderDish extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: 0,
            author: '',
            comment: ''
        }
    }



    
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }


    handleSubmit() {
        console.log(this.state);
        this.props.postComment(this.props.dish.id, this.state.rating, this.state.author, this.state.comment);
    }

    //gesture step 4 (rubberband) //step 5 in below <Animatable.View> tag
    handleViewRef = ref => this.view = ref; //getting view where we want to aplly rubberband effect

    render()
    {
        //----------Gesture step1 Start--------------

        const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
            if ( dx < -200 )
                return true;
            else
                return false;
        }
        
        const panResponder = PanResponder.create({

            onStartShouldSetPanResponder: (e, gestureState) => {
                return true;
            },
            // start gesture step 3 (rubberband)
            onPanResponderGrant: () => { 
                this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
            },
            // end gesture step 3 (rubberband)
            onPanResponderEnd: (e, gestureState) => {
                console.log("pan responder end", gestureState);
                if (recognizeDrag(gestureState))
                    Alert.alert(
                        'Add Favorite',
                        'Are you sure you wish to add ' + dish.name + ' to favorite?',
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => {this.props.favorite ? console.log('Already favorite') : this.props.onPress()}},
                        ],
                        { cancelable: false }
                    );
    
                return true;
            }
        })
        //----------Gesture step1 end step 2 in below <Animatable.View> tag --------------

        //-----Share Step 1  step 2 final step bwlo share icon--------------
        const shareDish = (title, message, url) => {
            Share.share({
                title: title,
                message: title + ': ' + message + ' ' + url,
                url: url
            },{
                dialogTitle: 'Share ' + title
            })
        }

        const dish = this.props.dish;
    
        if (dish != null) {
            return(
                <View>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                    /*step 5 gesture -->*/
                     ref={this.handleViewRef}
                     /*step 2 gesture -->*/
                      {...panResponder.panHandlers}>
                        <Card featuredTitle={dish.name}  image={{uri: baseUrl + dish.image}}>
                            <Text style={{margin: 10}}>
                                {dish.description}
                            </Text>
                            <View  style={styles.Row}>
                                <Icon //--step 15 for icon--
                                    raised //this icon prop makes icon looks like button
                                    reverse //revers tha color
                                    name={ this.props.favorite ? 'heart' : 'heart-o'}
                                    type='font-awesome'
                                    color='#f50'
                                    onPress={() => this.props.favorite ? console.log('Already favorite') : this.props.onPress()}
                                />

                                <Icon 
                                    raised 
                                    reverse 
                                    name={ 'comments'}
                                    type='font-awesome'
                                    color='#f51'
                                    onPress={() => this.toggleModal()}
                                />
                                <Icon
                                    raised
                                    reverse
                                    name='share'
                                    type='font-awesome'
                                    color='#51D2A8'
                                    style={styles.cardItem}
                                    onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />

                            </View>       
                        </Card>
                    </Animatable.View>

                    <Modal animationType = {"slide"} transparent = {false}
                        visible = {this.state.showModal}
                        onDismiss = {() => this.toggleModal() }
                        onRequestClose = {() => this.toggleModal() }>
                        <View style = {styles.modal}>
                            <Text style = {styles.modalTitle}>Post Comment</Text>
                            <Rating
                                type='heart'
                                ratingCount={5}
                                imageSize={60}
                                showRating
                                onFinishRating={ (value) => this.setState({rating: value})}/>


                            <Input
                                placeholder='Enter Name'
                                leftIcon={{ type: 'font-awesome', name: 'user',color:'#f50' }}
                                onChangeText = {(value) => this.setState({author: value})}
                            />

                            <Input
                                placeholder='Type Comment'
                                leftIcon={ <Icon name='edit' size={24}color='#f50'/>}
                                onChangeText = {(value) => this.setState({comment: value})}
                            />
                            <Button onPress = {() =>{this.handleSubmit(); this.toggleModal();}} color="#512DA8" title="Post Comment"  />
                            <Button onPress = {() =>{this.toggleModal();}} color="blue" title="Close" />
                        </View>
                    </Modal>
                </View>
               
                
            );
        }
        else {
            return(<View><Text>Null</Text></View>);
        }
    }
   
}


//step 13 icon( just related to icon clip)
function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Card>
                    <Text style={{fontSize: 14}}>{item.comment}</Text>
                    <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                    <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>

                    <Rating
                    type='heart'
                    imageSize={20}
                    readonly
                    startingValue={item.rating}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start'
                    }}
                    />
                </Card>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}



class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [] //adding favorite dish( step 16 icon )
        };
    }

    //step 16 icon
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }


    //step 7 navigation  setting header text
    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {

        //step 8 navigation  getting parameter from menucomponent step 9 in HomeCoponent
        const dishId = this.props.navigation.getParam('dishId','');

        return(
            //step 14 icon (related to icon clip)
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                    //step 17 icon
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    
                    postComment = {this.props.postComment}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    Row: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 30
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
