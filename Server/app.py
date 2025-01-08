from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contracts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Contract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contract_name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.String(20), nullable=False)
    end_date = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "contract_name": self.contract_name,
            "start_date": self.start_date,
            "end_date": self.end_date,
        }

class Point(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contract.id'), nullable=False)
    point = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "contract_id": self.contract_id,
            "point": self.point,
            "value": self.value,
        }

with app.app_context():
    db.create_all()


@app.route('/contracts', methods=['GET'])
def get_contracts():
    contracts = Contract.query.all()
    return jsonify([contract.to_dict() for contract in contracts]), 200

@app.route('/add_contract', methods=['POST'])
def add_contract():
    data = request.json
    try:
        new_contract = Contract(
            contract_name=data['contract_name'],
            start_date=data['start_date'],
            end_date=data['end_date']
        )
        db.session.add(new_contract)
        db.session.commit()
        return jsonify({"message": "Contract added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/update_contract/<int:contract_id>', methods=['PUT'])
def update_contract(contract_id):
    data = request.json
    try:
        contract = Contract.query.get(contract_id)
        if not contract:
            return jsonify({"error": "Contract not found"}), 404
        contract.contract_name = data['contract_name']
        contract.start_date = data['start_date']
        contract.end_date = data['end_date']
        db.session.commit()
        return jsonify({"message": "Contract updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/delete_contract/<int:contract_id>', methods=['DELETE'])
def delete_contract(contract_id):
    try:
        contract = Contract.query.get(contract_id)
        if not contract:
            return jsonify({"error": "Contract not found"}), 404
        
        points = Point.query.filter_by(contract_id=contract_id).all()
        for point in points:
            db.session.delete(point)

        db.session.delete(contract)
        db.session.commit()
        return jsonify({"message": "Contract and associated points deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/add_point', methods=['POST'])
def add_point():
    data = request.json
    try:
        new_point = Point(
            contract_id=data['contract_id'],
            point=data['point'],
            value=data['value']
        )
        db.session.add(new_point)
        db.session.commit()
        return jsonify({"message": "Point added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/get_points/<int:contract_id>', methods=['GET'])
def get_points(contract_id):
    points = Point.query.filter_by(contract_id=contract_id).all()
    return jsonify([point.to_dict() for point in points]), 200

@app.route('/update_point/<int:point_id>', methods=['PUT'])
def update_point(point_id):
    data = request.json
    try:
        point = Point.query.get(point_id)
        if not point:
            return jsonify({"error": "Point not found"}), 404
        point.point = data['point']
        point.value = data['value']
        db.session.commit()
        return jsonify({"message": "Point updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/delete_point/<int:point_id>', methods=['DELETE'])
def delete_point(point_id):
    try:
        point = Point.query.get(point_id)
        if not point:
            return jsonify({"error": "Point not found"}), 404
        db.session.delete(point)
        db.session.commit()
        return jsonify({"message": "Point deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/contracts_with_points', methods=['GET'])
def get_contracts_with_points():
    contracts = Contract.query.all()
    result = []
    for contract in contracts:
        points = Point.query.filter_by(contract_id=contract.id).all()
        total_points = len(points)
        total_value = sum(float(point.value) for point in points)
        result.append({
            "id": contract.id,
            "contract_name": contract.contract_name,
            "start_date": contract.start_date,
            "end_date": contract.end_date,
            "total_points": total_points,
            "total_value": total_value,
        })
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)
