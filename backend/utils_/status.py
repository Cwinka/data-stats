from typing import Tuple

class Status:
    """ Provides functionality to manage current status of operation """
    _status: Tuple[bool, str] = (200, "default")
    """ Represent status of an any operation.
        First value is status code
        Second value is a message of completed or failed operation
    """
    
    def set_status(self, status_code:int, msg:str):
        """ Updates status
            status_code: int - Status code
            msg: str - Message of completed or failed operation
        """
        self._status = (status_code, msg)
    
    def status_as_dict(self) -> dict:
        """ Returns dict representation of a status """
        if not self._status:
            return {}
        return {"detail":{"status_code": self._status[0], "message": self._status[1]}}
    
    def status_as_tuple(self) -> tuple:
        """ Returns status tuple (status_code, message) """
        return self._status

    @property
    def status_code(self):
        """ Return only first value of the status tuple
            wich means a successfull operation 
        """
        return self._status[0]

    @property
    def message(self):
        """ Return only second value of the status tuple
            wich contains message
        """
        return self._status[1]
