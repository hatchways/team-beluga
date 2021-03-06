"""empty message

Revision ID: e291a2f46ef8
Revises: f60a03e39f0b
Create Date: 2021-03-24 10:05:23.389565

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e291a2f46ef8'
down_revision = 'f60a03e39f0b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('access_token', sa.String(length=512), nullable=False))
    op.add_column('users', sa.Column('refresh_token', sa.String(length=512), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'refresh_token')
    op.drop_column('users', 'access_token')
    # ### end Alembic commands ###
