from flask import jsonify, Blueprint, request
from model.model import EventTypes
from config import db
from utils.auth.middleware import check_token

eventType_handler = Blueprint('eventType_handler', __name__)

# Backend field validation
def field_validation(data):
    if not data.get("title"):
        return False, "Event type title is missing!"

    if not data.get("url"):
        return False, "Event type url is missing!"
    
    if not data.get("duration"):
        return False, "Event type duration is missing!"
    
    return True,""


@eventType_handler.route('/',methods=["POST"])
@check_token
def create_eventType():
    data = request.get_json()
    valid_fields,msg = field_validation(data)

    if not valid_fields:
        return jsonify({"error":msg})
    
    new_eventType = EventTypes(
        user_id = data.get("user_id"),
        title = data.get("title"),
        url = data.get("url"),
        duration = data.get("duration"),
        color=data.get("color")
    )

    db.session.add(new_eventType)
    db.session.commit()

    return jsonify({
        "success":"Event type succesfully created!"
    })

@eventType_handler.route('/',methods=["GET"])
@check_token
def get_eventType():
    all_eventTypes = EventTypes.query.all()

    return jsonify([eventTypes.to_dict() for eventTypes in all_eventTypes])

@eventType_handler.route('/<int:id>',methods=["PUT"])
@check_token
def update_eventType(id):
    eventType_to_update = EventTypes.query.get(id)

    if not eventType_to_update:
        return jsonify({"error":f"Event type with id:{id} does not exist!"}) 

    data = request.get_json()

    valid_fields,msg = field_validation(data)

    if not valid_fields:
        return jsonify({"error":msg})

    eventType_to_update.title = data.get("title")
    eventType_to_update.url = data.get("url")
    eventType_to_update.duration = data.get("duration")

    db.session.commit()

    return jsonify({"success":"Event type succesfully updated!"})

@eventType_handler.route('/<int:id>',methods=["DELETE"])
@check_token
def delete_eventType(id):
    eventType_to_delete = EventTypes.query.get(id)

    if not eventType_to_delete:
        return jsonify({"error":f"Event type with id:{id} does not exist!"}) 

    db.session.delete(eventType_to_delete)
    db.session.commit()

    return jsonify({"success":"Event type successfully deleted!"}) 





